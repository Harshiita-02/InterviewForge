package com.interviewforge.backend.dtos.interview;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record InterviewAnswerRequest(
        @NotNull(message = "Question is required")
        Long questionId,

        @Size(max = 5000, message = "Answer must be at most 5000 characters")
        String text,                 // may be empty when the timer ran out

        String source,               // "TYPED" or "VOICE"

        Integer timeTakenSeconds     // optional
) {}