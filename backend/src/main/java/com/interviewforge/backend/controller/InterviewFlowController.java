package com.interviewforge.backend.controller;

import com.interviewforge.backend.dtos.interview.InterviewAnswerRequest;
import com.interviewforge.backend.dtos.interview.InterviewAnswerResult;
import com.interviewforge.backend.dtos.interview.InterviewResultResponse;
import com.interviewforge.backend.dtos.interview.InterviewStateResponse;
import com.interviewforge.backend.service.InterviewFlowService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
public class InterviewFlowController {

    private final InterviewFlowService flowService;

    @GetMapping("/{sessionId}")
    public ResponseEntity<InterviewStateResponse> getState(@PathVariable Long sessionId) {
        return ResponseEntity.ok(flowService.getState(sessionId));
    }

    @PostMapping("/{sessionId}/answers")
    public ResponseEntity<InterviewAnswerResult> submitAnswer(
            @PathVariable Long sessionId,
            @Valid @RequestBody InterviewAnswerRequest request
    ) {
        return ResponseEntity.ok(flowService.submitAnswer(sessionId, request));
    }

    @GetMapping("/{sessionId}/result")
    public ResponseEntity<InterviewResultResponse> getResult(@PathVariable Long sessionId) {
        return ResponseEntity.ok(flowService.getResult(sessionId));
    }
}