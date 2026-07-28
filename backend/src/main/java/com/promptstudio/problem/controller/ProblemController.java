package com.promptstudio.problem.controller;

import com.promptstudio.problem.domain.Problem;
import com.promptstudio.problem.repository.ProblemRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 공개 엔드포인트: 로그인 없이 문제 목록 조회 가능. */
@RestController
@RequestMapping("/problems")
public class ProblemController {

    private final ProblemRepository problemRepository;

    public ProblemController(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    @GetMapping
    public List<Problem> getProblems() {
        return problemRepository.findAll();
    }
}
