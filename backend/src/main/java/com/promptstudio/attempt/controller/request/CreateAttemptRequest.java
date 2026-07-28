package com.promptstudio.attempt.controller.request;

import jakarta.validation.constraints.NotNull;

/**
 * 주의: 여기에는 ownerId 가 없다. 소유자는 클라이언트가 보내지 않고
 * 서버가 세션(로그인 사용자)에서 주입한다.
 */
public record CreateAttemptRequest(
        @NotNull Long problemId
) {
}
