package com.interviewforge.backend.dtos.interview;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;

public record InterviewResultResponse(
        Long sessionId,
        String role,
        String type,
        String finalDifficulty,
        LocalDateTime completedAt,
        double overallScore,
        int answeredCount,
        int totalQuestions,
        long durationMinutes,
        String summary,
        List<String> strengths,
        List<String> improvements,
        List<QuestionResult> questions
) {

    public record QuestionResult(
            Long id,
            int number,
            String question,
            @JsonProperty("isFollowUp") boolean followUp,
            String answer,
            double score,
            String feedback
    ) {}
}