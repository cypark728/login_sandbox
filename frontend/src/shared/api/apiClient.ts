/**
 * 본 프로젝트 apiClient 를 세션 인증용으로 조정한 버전.
 * 차이점 2가지 (둘 다 세션+쿠키 인증의 핵심):
 *   1) credentials: 'include' — 세션 쿠키를 요청에 실어 보낸다.
 *   2) 에러를 백엔드 포맷 {code, message} 로 파싱한다.
 *      (본 프론트는 RFC7807 {type,title,status,detail} 을 기대 → 이식 시 이 부분을 통일해야 함)
 */
export interface ApiErrorBody {
  code: string;
  message: string;
  status: number;
}

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(body: ApiErrorBody) {
    super(body.message);
    this.name = 'ApiError';
    this.code = body.code;
    this.status = body.status;
  }
}

const API_BASE_PATH = import.meta.env.VITE_API_BASE_URL ?? '/api';

function createHeaders(init?: RequestInit): Headers {
  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  headers.set('Accept', 'application/json');
  return headers;
}

async function parseError(response: Response): Promise<ApiErrorBody> {
  try {
    const data = (await response.json()) as Partial<ApiErrorBody>;
    return {
      code: data.code ?? 'unknown',
      message: data.message ?? `요청 처리에 실패했습니다. (${response.status})`,
      status: response.status,
    };
  } catch {
    return {
      code: 'unknown',
      message: `요청 처리에 실패했습니다. (${response.status})`,
      status: response.status,
    };
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_PATH}${path}`, {
    ...init,
    credentials: 'include',
    headers: createHeaders(init),
  });

  if (!response.ok) {
    throw new ApiError(await parseError(response));
  }

  if (response.status === 204 || response.headers.get('Content-Length') === '0') {
    return undefined as T;
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
