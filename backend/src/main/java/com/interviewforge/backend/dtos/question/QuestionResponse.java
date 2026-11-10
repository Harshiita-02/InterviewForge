package com.interviewforge.backend.dtos.question;

import com.interviewforge.backend.entity.enums.DifficultyLevel;
import com.interviewforge.backend.entity.enums.QuestionSource;

public record QuestionResponse(
        Long id,
        String questionText,
        DifficultyLevel difficulty,
        Integer sequenceNo,
        QuestionSource generatedBy
) {}