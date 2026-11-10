package com.interviewforge.backend.dtos.feedbackReport;

public record FeedbackReportResponse(
        Long id,
        Long sessionId,
        Double overallScore,
        String strengths,
        String weaknesses,
        String summaryText,
        java.time.LocalDateTime createdAt
) {}
