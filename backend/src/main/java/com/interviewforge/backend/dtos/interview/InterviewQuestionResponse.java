package com.interviewforge.backend.dtos.interview;

import com.fasterxml.jackson.annotation.JsonProperty;

public record InterviewQuestionResponse(
        Long id,
        String text,
        int number,
        int total,
        @JsonProperty("isFollowUp") boolean followUp,
        String difficulty,          // "Easy" | "Medium" | "Hard"
        int timeLimitSeconds,
        String difficultyNote       // null unless the difficulty just changed
) {}