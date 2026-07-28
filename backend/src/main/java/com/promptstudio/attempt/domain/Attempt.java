package com.promptstudio.attempt.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

/**
 * 본 프로젝트의 attempt 개념을 "소유자 포함"으로 얇게 재현한 것.
 * 핵심: ownerId (= User.id) — 본 프로젝트에는 없던 소유자 참조 필드.
 * 이 값이 "내가 푼 문제"를 사용자별로 구분하는 기준이 된다.
 */
@Entity
@Table(name = "attempts")
public class Attempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long ownerId;

    @Column(nullable = false)
    private Long problemId;

    @Column(nullable = false)
    private Instant solvedAt;

    protected Attempt() {
    }

    private Attempt(Long ownerId, Long problemId, Instant solvedAt) {
        this.ownerId = ownerId;
        this.problemId = problemId;
        this.solvedAt = solvedAt;
    }

    public static Attempt record(Long ownerId, Long problemId) {
        return new Attempt(ownerId, problemId, Instant.now());
    }

    public Long getId() {
        return id;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public Long getProblemId() {
        return problemId;
    }

    public Instant getSolvedAt() {
        return solvedAt;
    }
}
