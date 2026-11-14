package com.interviewforge.backend.dtos.session;

import com.interviewforge.backend.entity.enums.DifficultyLevel;
import com.interviewforge.backend.entity.enums.InterviewType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record SessionCreateRequest(
        Long companyTemplateId,   // nullable: omit for a generic (non-company) session
        Long resumeId,            // nullable: omit to not use a resume

        @NotBlank(message = "Role is required")
        @Size(max = 100, message = "Role must be at most 100 characters")
        String role,

        @NotNull(message = "Interview type is required")
        InterviewType interviewType,

        @NotNull(message = "Difficulty is required")
        DifficultyLevel difficulty,

        List<String> topics   // topic names; unknown names (the "Other" chip) are created automatically
) {}