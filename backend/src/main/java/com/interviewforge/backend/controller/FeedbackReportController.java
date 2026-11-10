package com.interviewforge.backend.controller;

import com.interviewforge.backend.dtos.feedbackReport.FeedbackReportResponse;
import com.interviewforge.backend.service.FeedbackReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class FeedbackReportController {

    private final FeedbackReportService reportService;

    @PostMapping("/session/{sessionId}")
    public ResponseEntity<FeedbackReportResponse> generate(@PathVariable Long sessionId) {
        return ResponseEntity.ok(reportService.generateReport(sessionId));
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<FeedbackReportResponse> getBySession(@PathVariable Long sessionId) {
        return ResponseEntity.ok(reportService.getBySessionId(sessionId));
    }
}
