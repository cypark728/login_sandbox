package com.promptstudio.attempt.exception;

public class ProblemNotFoundException extends RuntimeException {

    public ProblemNotFoundException(Long problemId) {
        super("문제를 찾을 수 없습니다: " + problemId);
    }
}
