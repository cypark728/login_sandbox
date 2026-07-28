package com.promptstudio.attempt.controller;

import com.promptstudio.attempt.controller.request.CreateAttemptRequest;
import com.promptstudio.attempt.controller.response.AttemptResponse;
import com.promptstudio.attempt.domain.Attempt;
import com.promptstudio.attempt.service.AttemptService;
import com.promptstudio.global.security.AppUserDetails;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** 보호 엔드포인트: 로그인 사용자만 문제 풀이를 기록할 수 있다. */
@RestController
@RequestMapping("/attempts")
public class AttemptController {

    private final AttemptService attemptService;

    public AttemptController(AttemptService attemptService) {
        this.attemptService = attemptService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AttemptResponse create(
            @AuthenticationPrincipal AppUserDetails principal,
            @Valid @RequestBody CreateAttemptRequest request
    ) {
        // 핵심: ownerId 는 요청 바디가 아니라 세션 사용자(principal)에서 가져온다.
        Attempt attempt = attemptService.record(principal.getId(), request.problemId());
        return AttemptResponse.from(attempt);
    }
}
