# 로그인 학습 가이드

> 이 문서는 `login-sandbox`에서 만든 **세션 + 쿠키 로그인**을 나중에 혼자서도 다시 구현할 수 있도록 정리한 학습 자료입니다. 초보자 눈높이로, 실제 이 프로젝트 코드에 밀착해 설명합니다.

## 0. 이 가이드를 읽는 법

로그인은 "코드 몇 개"가 아니라 **"낯선 사람을 어떻게 계속 알아볼 것인가"** 라는 문제를 푸는 시스템입니다.
그래서 이 순서로 갑니다: 비유로 감 잡기(1) → 요청이 실제로 도는 길(2) → 백지에서 순서대로 만들기(3) → 용어 정리(4) → 함정 피하기(5) → 얻는 지식(6) → 다음 로드맵(7).

---

## 1. 로그인이란? (식당 번호표 비유)

HTTP는 **기억상실증**이 있습니다. 요청 하나가 끝나면 서버는 당신을 즉시 잊습니다. 그래서 매 요청마다 "당신 누구세요?"를 다시 해결해야 합니다. 로그인은 이걸 매끄럽게 하는 장치입니다.

| 식당 | 웹 로그인 |
|---|---|
| 입장 시 신분 확인하고 **번호표**를 줌 | 로그인 성공 → **세션 쿠키** 발급 |
| 손님은 번호표만 보여주면 됨 (매번 신분증 X) | 이후엔 **쿠키만** 자동으로 보냄 |
| 주방 벽 **주문 장부**에 "3번 = 김OO" | 서버 **세션 저장소**에 "이 세션 = alice" |
| 번호표 잃어버리면 다시 확인 | 쿠키 없으면 다시 로그인 |
| 나갈 때 번호표 반납 | 로그아웃 → 세션 파기 |

**핵심 3단어**
- **인증(Authentication)**: "너 누구야?" → 신분 확인 (로그인)
- **인가(Authorization)**: "너 이거 해도 돼?" → 권한 확인 (이 API 접근 가능?)
- **세션(Session)**: 서버가 "누가 로그인 중인지" 기억하는 장부

우리가 고른 방식은 **세션 + 쿠키**입니다. 번호표(쿠키)는 손님이 들고, 진짜 정보(누구인지)는 주방 장부(서버 세션)에 있습니다. 손님 주머니엔 "3번"이라는 의미 없는 번호만 있어서 훔쳐봐도 쓸모가 적습니다. → **HttpOnly 쿠키**라 자바스크립트로도 못 읽습니다(보안상 좋음).

---

## 2. 요청이 도는 길

### 2-1. 로그인할 때

```
[브라우저]  "alice / 1234 로 로그인"  (POST /auth/login)
     │
     ▼
[Security 필터]  이 주소는 로그인 없이 허용? → /auth/login 은 OK, 통과
     │
     ▼
[AuthController]  ① 아이디/비번 맞아? → DB에서 alice 찾아 BCrypt로 대조
                  ② 맞으면 "이 사람 alice다"를 세션에 저장 (saveContext)
     │
     ▼
[응답]  200 + Set-Cookie: JSESSIONID=abc123; HttpOnly
     │
     ▼
[브라우저]  쿠키 abc123 저장. 앞으로 모든 요청에 자동 첨부
```

**제일 중요한 통찰**: 로그인은 "비번 확인"으로 끝이 아니라, **"확인 결과를 세션에 저장하고 번호표(쿠키)를 발급"** 까지가 한 세트. 이 저장 단계(`saveContext`)가 빠지면 로그인은 되는데 다음 요청에서 또 남남이 됩니다. (초보가 제일 많이 막히는 지점)

### 2-2. 로그인 후 다른 요청 (예: 내 정보 보기)

```
[브라우저]  GET /me  (쿠키 abc123 자동 첨부)
     │
     ▼
[Security 필터]  쿠키의 JSESSIONID로 세션 조회 → "아, alice네"
                 /me 는 로그인 필요 → alice 로그인됨 → 통과
     │
     ▼
[MeController]  현재 사용자(alice) 정보 반환
```

**통찰**: 매 요청마다 이 검사가 자동으로 돕니다. 컨트롤러에서 "로그인 체크"를 직접 안 하는 이유 — **Security 필터가 컨트롤러보다 먼저** 문지기 역할.

### 2-3. 로그인 안 한 사람이 /me를 부르면?

```
[브라우저]  GET /me  (쿠키 없음)
     │
     ▼
[Security 필터]  세션 못 찾음 + /me는 로그인 필요 → 컨트롤러 도달 전 차단
     │
     ▼
[응답]  401 {"code":"unauthenticated","message":"로그인이 필요합니다."}
```

---

## 3. 백지에서 다시 만들기 체크리스트

나중에 혼자 구현할 때 이 순서대로 따라가면 됩니다. (Spring Boot 기준, 이 프로젝트 파일명 병기)

### 백엔드
```
☐ 1. 의존성에 spring-boot-starter-security 추가          → build.gradle
       (이 줄 넣는 순간 모든 URL이 잠긴다. 그걸 푸는 게 3번)
☐ 2. User 엔티티 (id, username, passwordHash)            → user/domain/User.java
       + UserRepository (findByUsername)                → user/repository/
       ★ 비번은 절대 평문 저장 X → passwordHash 필드명으로 강제
☐ 3. SecurityConfig                                     → global/config/SecurityConfig.java
       - PasswordEncoder(BCrypt) 빈
       - AuthenticationManager 빈
       - SecurityFilterChain: 공개 URL은 permitAll, 나머지 authenticated
       - 미인증/권한없음 시 JSON 401/403 반환 핸들러 연결
☐ 4. "username으로 사용자 찾는 법" 제공                    → AppUserDetailsService
       (Spring Security가 로그인 검증할 때 이걸 호출)
☐ 5. 로그인 주체에 id 담기                               → AppUserDetails
       (나중에 "누가 요청했는지" 꺼내 쓰려고)
☐ 6. AuthController: register / login / logout          → auth/controller/
       login = 검증 → SecurityContext 저장 → saveContext(세션+쿠키)
☐ 7. 내 데이터 엔티티에 ownerId 붙이기                    → attempt/domain/Attempt.java
       + findByOwnerId 조회
☐ 8. 보호 컨트롤러: @AuthenticationPrincipal로 사용자 꺼냄  → MeController, AttemptController
       ★ ownerId는 세션에서. 클라이언트가 보낸 값 신뢰 X
☐ 9. 에러 포맷 통일 (@RestControllerAdvice)              → global/exception/
☐ 10. CORS 설정 (allowCredentials=true, 명시적 origin)   → global/config/CorsConfig.java
```

### 프론트엔드
```
☐ 11. fetch에 credentials:'include' (쿠키 실어보내기 — 필수!)  → apiClient.ts
☐ 12. 로그인/회원가입 폼 + api 함수                            → pages/, features/auth/api.ts
☐ 13. 로그인 상태 보관 (Context) — 앱 켜질 때 GET /me로 확인     → AuthContext.tsx
☐ 14. 보호 라우트 (로그인 안 하면 /login으로)                   → ProtectedRoute.tsx
☐ 15. (개발용) Vite 프록시로 /api → 백엔드                      → vite.config.ts
```

**한 줄 암기**
백엔드는 **"잠그고(Security) → 열어주고(permitAll) → 검증하고(login) → 저장하고(session) → 꺼내 쓴다(@AuthenticationPrincipal)"**,
프론트는 **"쿠키 실어보내고(include) → 상태 물어보고(GET /me) → 못 하면 막는다(보호 라우트)"**.

---

## 4. 핵심 용어 사전

| 용어 | 아주 쉽게 | 이 프로젝트에서 |
|---|---|---|
| **인증 / 인가** | "너 누구?" / "너 해도 돼?" | login / SecurityConfig 규칙 |
| **세션(Session)** | 서버가 로그인한 사람을 기억하는 장부 | `HttpSession`, JSESSIONID |
| **쿠키(Cookie)** | 브라우저가 들고 다니는 쪽지, 요청마다 자동 첨부 | `Set-Cookie: JSESSIONID=...` |
| **HttpOnly** | JS로 못 읽는 쿠키 (탈취 방어) | 로그인 응답 쿠키 속성 |
| **BCrypt** | 비번을 되돌릴 수 없게 뭉갠 것(해시). 같은 비번도 매번 다르게 저장 | `PasswordEncoder` |
| **Spring Security** | 모든 요청 앞에 서는 자동 문지기(필터체인) | `SecurityConfig` |
| **필터체인** | 컨트롤러 도달 전 거치는 검문소들 | 인증/인가/CORS 검사 |
| **JPA / 엔티티** | 자바 클래스 ↔ DB 테이블 자동 연결 | `@Entity User`, `Attempt` |
| **Repository** | 메서드 이름만 지으면 SQL이 되는 DB 창구 | `findByUsername` |
| **DTO** | 요청/응답 전용 데이터 상자 (엔티티 직접 노출 X) | `LoginRequest`, `MeResponse` |
| **CORS** | "다른 주소(포트)에서 온 요청 허용?" 규칙 | `CorsConfig` |
| **CSRF** | 로그인된 걸 악용해 몰래 요청 보내는 공격 | 방어 ON: `XSRF-TOKEN` 쿠키 + `X-XSRF-TOKEN` 헤더 대조 |
| **@AuthenticationPrincipal** | "지금 로그인한 사람"을 컨트롤러에서 바로 받기 | ownerId 출처 |

---

## 5. 흔한 실수 / 보안 함정 (이 프로젝트에서 실제로 겪은 것 포함)

1. **`saveContext` 빠뜨림** → 로그인은 200인데 다음 요청부터 매번 401. "왜 로그인이 유지가 안 되지?"의 90%.
2. **프론트에서 `credentials:'include'` 안 함** → 쿠키가 안 실려 서버가 매번 "누구세요?". 로그인 성공했는데 /me가 401이면 이거 의심.
3. **CORS + 포트 함정** (직접 겪음): 자격증명(쿠키) 쓸 땐 `allowedOrigins("*")` 불가 + **정확한 origin** 필요. 프론트 포트가 5173→5174로 바뀌자 origin이 안 맞아 **403**. curl은 되는데 브라우저만 안 되면 CORS를 의심.
4. **비밀번호 평문 저장** → 절대 금지. 반드시 BCrypt 등으로 해시. (필드명을 `passwordHash`로 지어 실수를 막음)
5. **클라이언트가 보낸 userId를 믿음** → 최악의 취약점. 남의 id를 넣어 남의 데이터 조작 가능. **소유자는 항상 세션(@AuthenticationPrincipal)에서** 꺼낸다. (`ownerId:999`를 보내도 무시된 이유)
6. **엔티티를 그대로 응답** → `passwordHash`까지 노출될 수 있음. **응답 DTO로 감싸서** 내보낼 필드만 통제.
7. **URL에 userId 노출** (`/users/5/attempts`) → 5를 6으로 바꿔 남의 것 조회 시도(IDOR). `/me/attempts`처럼 "나"는 세션이 알게.
8. **CSRF 방어** (이 샌드박스는 적용 완료) → 세션+쿠키는 브라우저가 쿠키를 자동 첨부하므로 위조 요청에 노출된다. 방어: 서버가 `XSRF-TOKEN` 쿠키 발급 → 프론트가 상태 변경 요청에 `X-XSRF-TOKEN` 헤더로 되보냄 → 서버가 둘을 대조(불일치 시 403). 쿠키는 자동으로 실려도 **헤더는 남의 사이트가 못 채우는** 점이 방어의 핵심. GET 등 안전한 메서드는 검사 안 함.
9. **막을 것만 나열하는 인가 설정** → 새 API 추가 시 실수로 뚫림. **"공개할 것만 열고 나머지 전부 잠그기"**(`anyRequest().authenticated()`)가 안전한 기본값.

---

## 6. 이 프로젝트에서 얻는 "백엔드 지식" 정리

로그인 하나를 만들었지만, 사실 백엔드의 뼈대 개념을 거의 다 만졌습니다:

- **계층형 구조**: Controller(HTTP) → Service(규칙) → Repository(DB). "얇은 컨트롤러, 규칙은 서비스"
- **의존성 주입(DI)**: `@Bean`으로 만든 걸 생성자로 받아 쓰기 (설정과 사용의 분리)
- **JPA 영속성**: 자바 객체가 어떻게 테이블이 되고 저장·조회되는가
- **인증/인가 파이프라인**: 필터체인이 요청을 가로채는 구조
- **비밀번호/세션/쿠키 보안**: 해시, HttpOnly, 소유권 검증
- **예외의 중앙 처리**: `@RestControllerAdvice`로 에러 포맷 통일
- **프론트-백 계약**: CORS, 프록시, 에러 포맷 일치 등 "두 프로젝트를 붙일 때 생기는 문제들"

---

## 7. 다음 학습 로드맵

```
1단계 (완료) : 세션+쿠키 로그인 ✅
2단계 (완료) : CSRF 방어 켜기 (CookieCsrfTokenRepository) ✅
3단계        : 권한 등급 (ROLE_USER / ROLE_ADMIN) → 인가 심화
4단계        : JWT 방식도 만들어보고 세션 방식과 비교 (장단점 체득)
5단계        : 리프레시 토큰 / 자동 로그인 / 소셜 로그인(OAuth2)
6단계        : 세션을 Redis로 (서버 여러 대일 때)
```

**다음 추천 실습**: 3단계(권한 등급). `ROLE_ADMIN` 사용자를 만들고, 관리자 전용 엔드포인트를 `hasRole("ADMIN")` 로 막아 403이 나는지 확인해보면 인가(Authorization)를 몸으로 익힐 수 있습니다.

### CSRF는 구체적으로 어떻게 켰나 (2단계 구현 요약)

- **백엔드** (`SecurityConfig`): `csrf.disable()` 제거 → `CookieCsrfTokenRepository.withHttpOnlyFalse()` + `CsrfTokenRequestAttributeHandler` 적용. H2 콘솔은 `ignoringRequestMatchers` 로 예외. 지연 로딩된 토큰이 항상 쿠키로 나가도록 `CsrfCookieFilter`(매 요청 `getToken()` 호출) 추가.
- **프론트** (`apiClient.ts`): GET/HEAD 외 요청에서 `XSRF-TOKEN` 쿠키를 읽어 `X-XSRF-TOKEN` 헤더로 첨부. 앱 마운트 시 `GET /me` 가 먼저 쿠키를 발급해 두므로 첫 로그인 POST 때 토큰이 준비돼 있음.
- **검증**: 토큰 없이 POST → 403, 토큰 포함 → 200. 브라우저에서는 `apiClient` 가 자동 처리하므로 회원가입/로그인/풀이기록이 그대로 동작.

---

## 부록: 이 샌드박스 빠른 실행

```bash
# 백엔드 (포트 9090)
cd backend && ./gradlew bootRun

# 프론트 (포트 5173, 사용 중이면 5174)
cd frontend && npm install && npm run dev
```

- 시나리오: SIGN UP → 문제 MARK SOLVED → MY PAGE에서 기록 확인 → LOGOUT 후 /mypage 접근 시 로그인으로 리다이렉트
- 자세한 실행/검증은 [README.md](README.md) 참고. H2가 인메모리라 백엔드 재시작 시 데이터는 초기화됩니다.
