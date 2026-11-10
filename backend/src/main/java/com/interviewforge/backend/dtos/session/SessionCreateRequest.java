package com.interviewforge.backend.dtos.session;

import com.interviewforge.backend.entity.enums.DifficultyLevel;
import com.interviewforge.backend.entity.enums.InterviewType;

import java.util.List;

public record SessionCreateRequest(
        Long userId,
        Long companyTemplateId,   // nullable — omit for a generic (non-company) session
        String role,
        InterviewType interviewType,
        DifficultyLevel difficulty,
        List<Long> topicIds
) {}