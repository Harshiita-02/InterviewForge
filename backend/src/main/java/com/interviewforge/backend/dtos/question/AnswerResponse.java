package com.interviewforge.backend.dtos.question;

public record AnswerResponse(
        Long id,
        Long questionId,
        String questionText,
        String answerText,
        Double score,
        String feedbackText,
        Integer timeTakenSeconds,
        java.time.LocalDateTime evaluatedAt
) {}