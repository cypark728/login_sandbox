package com.promptstudio.attempt.service;

import com.promptstudio.attempt.domain.Attempt;
import com.promptstudio.attempt.exception.ProblemNotFoundException;
import com.promptstudio.attempt.repository.AttemptRepository;
import com.promptstudio.problem.repository.ProblemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AttemptService {

    private final AttemptRepository attemptRepository;
    private final ProblemRepository problemRepository;

    public AttemptService(AttemptRepository attemptRepository, ProblemRepository problemRepository) {
        this.attemptRepository = attemptRepository;
        this.problemRepository = problemRepository;
    }

    /** ownerId 는 컨트롤러가 세션 사용자에서 넘겨준다(클라이언트 입력 아님). */
    @Transactional
    public Attempt record(Long ownerId, Long problemId) {
        if (!problemRepository.existsById(problemId)) {
            throw new ProblemNotFoundException(problemId);
        }
        return attemptRepository.save(Attempt.record(ownerId, problemId));
    }

    @Transactional(readOnly = true)
    public List<Attempt> findMyAttempts(Long ownerId) {
        return attemptRepository.findByOwnerIdOrderBySolvedAtDesc(ownerId);
    }
}
