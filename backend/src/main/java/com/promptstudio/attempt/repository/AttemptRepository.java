package com.promptstudio.attempt.repository;

import com.promptstudio.attempt.domain.Attempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttemptRepository extends JpaRepository<Attempt, Long> {

    /** 소유자(현재 로그인 사용자) 기준으로 '내가 푼 문제' 조회. */
    List<Attempt> findByOwnerIdOrderBySolvedAtDesc(Long ownerId);
}
