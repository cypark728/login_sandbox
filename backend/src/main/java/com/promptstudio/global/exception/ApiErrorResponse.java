package com.promptstudio.global.exception;

/**
 * 본 프로젝트(S15P11A505-backend)의 에러 응답 포맷을 그대로 복제한다.
 * 필드: code, message.
 */
public record ApiErrorResponse(
        String code,
        String message
) {
}
