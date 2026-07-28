package com.promptstudio.me.controller;

import com.promptstudio.attempt.controller.response.AttemptResponse;
import com.promptstudio.attempt.service.AttemptService;
import com.promptstudio.auth.controller.response.MeResponse;
import com.promptstudio.global.security.AppUserDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 보호 엔드포인트: 현재 로그인 사용자 자신의 정보/기록만 조회. */
@RestController
@RequestMapping("/me")
public class MeController {

    private final AttemptService attemptService;

    public MeController(AttemptService attemptService) {
        this.attemptService = attemptService;
    }

    @GetMapping
    public MeResponse me(@AuthenticationPrincipal AppUserDetails principal) {
        return new MeResponse(principal.getId(), principal.getUsername());
    }

    /** '내가 푼 문제' — 소유자=현재 사용자인 attempt 목록만 반환. */
    @GetMapping("/attempts")
    public List<AttemptResponse> myAttempts(@AuthenticationPrincipal AppUserDetails principal) {
        return attemptService.findMyAttempts(principal.getId()).stream()
                .map(AttemptResponse::from)
                .toList();
    }
}
