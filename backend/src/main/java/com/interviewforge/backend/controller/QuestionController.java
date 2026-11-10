package com.interviewforge.backend.controller;

import com.interviewforge.backend.dtos.question.AnswerResponse;
import com.interviewforge.backend.dtos.question.AnswerSubmitRequest;
import com.interviewforge.backend.dtos.question.QuestionResponse;
import com.interviewforge.backend.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping("/session/{sessionId}/next")
    public ResponseEntity<QuestionResponse> generateNext(@PathVariable Long sessionId) {
        return ResponseEntity.ok(questionService.generateNextQuestion(sessionId));
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<QuestionResponse>> getBySession(@PathVariable Long sessionId) {
        return ResponseEntity.ok(questionService.getBySessionId(sessionId));
    }

    @PostMapping("/answers")
    public ResponseEntity<AnswerResponse> submitAnswer(@RequestBody AnswerSubmitRequest request) {
        return ResponseEntity.ok(questionService.submitAnswer(request));
    }
}