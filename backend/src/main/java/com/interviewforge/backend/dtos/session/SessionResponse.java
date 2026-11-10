package com.interviewforge.backend.dtos.session;

import com.interviewforge.backend.entity.enums.DifficultyLevel;
import com.interviewforge.backend.entity.enums.InterviewType;
import com.interviewforge.backend.entity.enums.SessionStatus;

import java.time.LocalDateTime;
import java.util.List;

public record SessionResponse(
        Long id,
        Long userId,
        String companyTemplateName,  // null if no template was used
        String role,
        InterviewType interviewType,
        DifficultyLevel difficulty,
        SessionStatus status,
        LocalDateTime startedAt,
        LocalDateTime endedAt,
        List<String> topicNames
) {}