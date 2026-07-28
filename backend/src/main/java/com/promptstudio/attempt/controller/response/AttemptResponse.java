package com.promptstudio.attempt.controller.response;

import com.promptstudio.attempt.domain.Attempt;

import java.time.Instant;

public record AttemptResponse(
        Long id,
        Long problemId,
        Instant solvedAt
) {

    public static AttemptResponse from(Attempt attempt) {
        return new AttemptResponse(attempt.getId(), attempt.getProblemId(), attempt.getSolvedAt());
    }
}
