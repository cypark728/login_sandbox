package com.promptstudio.auth.controller.response;

/** 현재 로그인 사용자 정보 (비밀번호 해시는 절대 노출하지 않음). */
public record MeResponse(
        Long id,
        String username
) {
}
