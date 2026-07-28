package com.promptstudio.problem.domain;

/**
 * 샌드박스에서는 문제를 목록/식별 용도로만 최소화한다.
 * (본 프로젝트의 Problem 개념과 매칭만 맞추면 됨.)
 */
public record Problem(
        Long id,
        String title
) {
}
