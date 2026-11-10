package com.interviewforge.backend.dtos.question;

public record AnswerSubmitRequest(
        Long questionId,
        String answerText,
        Integer timeTakenSeconds
) {}