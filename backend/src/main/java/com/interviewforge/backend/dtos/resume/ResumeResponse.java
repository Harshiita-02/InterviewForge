package com.interviewforge.backend.dtos.resume;
import java.time.LocalDateTime;

public record ResumeResponse(
        Long id,
        Long userId,
        String filePath,
        String parsedSkills,
        LocalDateTime uploadedAt
) {}
