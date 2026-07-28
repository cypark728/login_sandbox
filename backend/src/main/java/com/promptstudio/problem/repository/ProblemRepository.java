package com.promptstudio.problem.repository;

import com.promptstudio.problem.domain.Problem;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 본 프로젝트와 동일하게 문제는 하드코딩(인메모리)으로 둔다.
 * 샌드박스의 관심사는 인증/소유자이지 문제 저장이 아니다.
 */
@Repository
public class ProblemRepository {

    private final List<Problem> problems = List.of(
            new Problem(1L, "Hello World 출력"),
            new Problem(2L, "SSAFY 출력"),
            new Problem(3L, "환영 메시지 출력")
    );

    public List<Problem> findAll() {
        return problems;
    }

    public Optional<Problem> findById(Long id) {
        return problems.stream().filter(p -> p.id().equals(id)).findFirst();
    }

    public boolean existsById(Long id) {
        return findById(id).isPresent();
    }
}
