# login-sandbox

세션 + 쿠키(HttpOnly) 기반 로그인을 **본 프로젝트에 손대지 않고** 따로 연습·검증하기 위한 독립 샌드박스입니다.
본 프로젝트(`S15P11A505-backend` / `S15P11A505-frontend`)와 **동일한 스택·구조·명명 규약**으로 만들어, 여기서 검증한 방식을 그대로 이식하는 것이 목표입니다.

- 목표 기능: **로그인한 사용자마다 "내가 푼 문제"를 확인**할 수 있는 개인화 슬라이스
- 인증 방식: **세션 + HttpOnly 쿠키 (Spring Security)** — JS에 토큰을 저장하지 않음
- 스택: Spring Boot 4.1 / Java 21 / (H2 인메모리) · React 19 / Vite 7 / react-router 7

```
login-sandbox/
├─ backend/    Spring Boot (세션 인증 + JPA)
└─ frontend/   React SPA (로그인/회원가입/마이페이지)
```

---

## 1. 요구사항

- **JDK 21** (`java -version`)
- **Node.js 18+** & npm (`node -v`)
- 별도 DB 설치 불필요 — 백엔드는 **H2 인메모리**를 사용합니다.

---

## 2. 실행 방법 (터미널 2개)

### ① 백엔드 (포트 9090)

```bash
cd login-sandbox/backend
./gradlew bootRun
```

- 콘솔에 `Started BackendApplication` 이 뜨면 준비 완료.
- Windows PowerShell/cmd에서는 `gradlew bootRun` (앞의 `./` 없이).

### ② 프론트엔드 (포트 5173)

```bash
cd login-sandbox/frontend
npm install   # 최초 1회
npm run dev
```

- 터미널에 출력되는 **`Local: http://localhost:5173/`** 주소로 접속합니다.
- ⚠️ 5173 포트가 이미 사용 중이면 Vite가 **5174 등으로 자동 변경**합니다. 반드시 터미널에 찍힌 실제 주소를 사용하세요.
- 프론트는 `/api/*` 요청을 Vite 프록시로 백엔드(9090)에 전달합니다. 덕분에 브라우저 입장에선 same-origin이 되어 세션 쿠키가 자연스럽게 오갑니다.

---

## 3. 직접 확인하는 방법

### A. 브라우저로 클릭해서 확인 (권장)

1. `http://localhost:5173/` 접속 → 홈에 문제 목록이 보임 (로그인 없이 조회 가능)
2. 우측 상단 **SIGN UP** → 사용자명(3~30자)/비밀번호(8자 이상) 입력 → 가입 즉시 로그인되어 **마이페이지**로 이동
3. 홈으로 이동 → 헤더가 `@사용자명 / MY PAGE / LOGOUT` 로 바뀜 (새로고침해도 유지 = 쿠키 세션 인식)
4. 문제 옆 **MARK SOLVED** 클릭 → **SOLVED ✓** 로 바뀜
5. **MY PAGE** → 방금 푼 문제가 시각과 함께 기록됨 (**본인 것만** 보임)
6. **LOGOUT** 후 주소창에 `/mypage` 직접 입력 → **로그인 페이지로 리다이렉트** (보호 라우트)

> 다른 사용자로 하나 더 가입해 보면, 서로의 "푼 문제"가 보이지 않는 것(사용자 격리)을 확인할 수 있습니다.

### B. 개발자 도구로 쿠키 확인

- 로그인 직후 **F12 → Network → login 요청 → Response Headers** 에 `Set-Cookie: JSESSIONID=...; HttpOnly` 확인.
- **Application → Cookies** 에 `JSESSIONID` 가 저장되고, 이후 요청에 자동으로 실려 나감.

### C. 터미널(curl)로 API 직접 확인

```bash
# 1) 회원가입
curl -i -X POST http://localhost:9090/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"password123"}'

# 2) 로그인 (쿠키를 cookies.txt 에 저장)
curl -i -c cookies.txt -X POST http://localhost:9090/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"password123"}'
#    → 응답 헤더에 Set-Cookie: JSESSIONID=...; HttpOnly

# 3) 내 정보 (쿠키 동봉)
curl -b cookies.txt http://localhost:9090/me

# 4) 문제 풀이 기록 — 바디에 ownerId 를 넣어도 무시되고 세션 사용자로 저장됨
curl -b cookies.txt -X POST http://localhost:9090/attempts \
  -H "Content-Type: application/json" \
  -d '{"problemId":1,"ownerId":999}'

# 5) 내가 푼 문제
curl -b cookies.txt http://localhost:9090/me/attempts

# 6) 로그아웃 후 보호 API 재호출 → 401
curl -b cookies.txt -X POST http://localhost:9090/auth/logout
curl -b cookies.txt http://localhost:9090/me      # {"code":"unauthenticated", ...}
```

### D. H2 콘솔로 DB 직접 보기

- `http://localhost:9090/h2-console`
- JDBC URL: `jdbc:h2:mem:sandbox`, 사용자: `sa`, 비밀번호: (빈칸)
- `USERS` 테이블에서 비밀번호가 **BCrypt 해시**로 저장된 것, `ATTEMPTS` 테이블의 `OWNER_ID` 를 확인.

---

## 4. API 요약

| Method | URL | 인가 | 설명 |
|---|---|---|---|
| POST | `/auth/register` | 공개 | 회원가입 (비밀번호 BCrypt 해시 저장) |
| POST | `/auth/login` | 공개 | JSON 로그인 → 세션 쿠키 발급 |
| POST | `/auth/logout` | 로그인 | 세션 무효화 |
| GET | `/me` | 로그인 | 현재 사용자 정보 |
| GET | `/me/attempts` | 로그인 | **내가 푼 문제** (소유자=본인) |
| POST | `/attempts` | 로그인 | 풀이 기록 (ownerId는 세션에서 주입) |
| GET | `/problems` | 공개 | 문제 목록 |

에러 응답 포맷은 본 백엔드와 동일한 `{"code": "...", "message": "..."}` 입니다.
(예: `unauthenticated` 401, `bad-credentials` 401, `duplicate-username` 400, `invalid-request` 400, `access-denied` 403)

---

## 5. 핵심 학습 포인트

1. **세션을 세션 저장소에 저장 → 쿠키로 유지**
   `AuthController.login` 이 `SecurityContextRepository.saveContext(...)` 로 인증을 세션에 저장하고, 응답에 `JSESSIONID`(HttpOnly) 가 실린다.
2. **소유자(ownerId)는 절대 클라이언트에서 받지 않는다**
   `CreateAttemptRequest` 에는 `ownerId` 필드가 없고, `AttemptController` 가 `@AuthenticationPrincipal` 에서 사용자 id를 꺼내 주입한다. → 남의 데이터를 만들 수 없음.
3. **프론트는 `credentials: 'include'` 필수**
   `apiClient` 가 이 옵션으로 쿠키를 요청에 실어 보낸다. 이게 빠지면 로그인해도 매 요청이 비로그인 취급된다.
4. **CORS + 쿠키의 함정** (실제로 겪은 이슈)
   자격증명(쿠키)을 주고받을 땐 CORS `allowedOrigins` 에 `"*"` 를 쓸 수 없고 **명시적 origin**이 필요하며 `allowCredentials(true)` 여야 한다. 프론트 포트가 5173→5174로 바뀌면 origin이 달라져 **403**이 난다. (샌드박스는 `http://localhost:*` 패턴으로 허용)
5. **CSRF 방어 (Double Submit Cookie)**
   세션+쿠키는 브라우저가 쿠키를 자동 첨부하므로 위조 요청(CSRF)에 노출된다. 방어책: 서버가 JS로 읽을 수 있는 `XSRF-TOKEN` 쿠키를 발급 → 프론트가 상태 변경 요청에 `X-XSRF-TOKEN` 헤더로 되보냄 → 서버가 쿠키 토큰과 헤더 토큰을 대조. 쿠키는 자동으로 실리지만 **헤더는 남의 사이트가 못 채우므로** 위조가 막힌다. 토큰 없이 POST 하면 **403**.
6. **로그인 여부는 서버에 물어본다**
   토큰을 JS에 저장하지 않으므로, 프론트는 앱 로드 시 `GET /me` 로 세션 유효성을 확인한다(`AuthContext`).

---

## 6. 주의사항 (샌드박스 특성)

- **H2 인메모리** — 백엔드를 재시작하면 가입한 계정·기록이 **모두 사라집니다**(의도된 동작). 영속화하려면 `application.yml` 의 `spring.datasource.url` 을 파일 H2(`jdbc:h2:file:./data/sandbox`)로, `ddl-auto` 를 `update` 로 바꾸세요.
- **CSRF는 활성화됨** (2단계 완료) — `SecurityConfig` 가 `CookieCsrfTokenRepository` 로 `XSRF-TOKEN` 쿠키를 발급하고, 상태 변경 요청(POST/PUT/DELETE)은 `X-XSRF-TOKEN` 헤더로 그 값을 되보내야 통과합니다. 프론트 `apiClient` 가 이 헤더를 자동으로 붙입니다. (GET 등 안전한 메서드·H2 콘솔은 예외)
- 포트: 백엔드 9090 고정, 프론트 5173(사용 중이면 자동 변경).

---

## 7. 본 프로젝트 이식 매핑 (요약)

| 샌드박스 산출물 | 본 프로젝트 이식 위치 |
|---|---|
| `SecurityConfig`, `PasswordEncoder`, 401/403 핸들러 | 백엔드 `global/config` |
| `User` 엔티티 + `UserRepository` | 백엔드 신규 `user` 패키지 (JPA 최초 도입) |
| `Attempt.ownerId` + `findByOwnerId...` | 기존 `attempt` 도메인 (인메모리 → JPA/소유자) |
| ownerId를 세션에서 주입하는 규칙 | 본 `AttemptController` |
| 전역 CORS + allowCredentials | 본 빈 `WebConfig`/`SecurityConfig` |
| `AuthContext` + 보호 라우트 + `credentials:'include'` | 본 프론트 `src/features/auth`, `router.tsx` |
| `LoginPage`/`MyPage` (동일 스타일 규약) | 본 `src/pages` |

**이식 전 정리할 기존 불일치**
1. 본 프론트 `apiClient` 는 에러를 RFC7807(`type/title/status/detail`)로 파싱하는데, 본 백엔드는 `{code,message}` 를 반환 → 한쪽으로 통일 필요. (샌드박스는 `{code,message}` 로 통일함)
2. 본 프론트 `vite.config.ts` 프록시 target 이 `8080` 인데 본 백엔드 포트는 `9090` → 정렬 필요.
3. CSRF 정책 확정 후 이식에 반영.
