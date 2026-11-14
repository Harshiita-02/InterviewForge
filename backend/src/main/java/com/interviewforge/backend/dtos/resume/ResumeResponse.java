package com.interviewforge.backend.dtos.resume;

import java.time.LocalDateTime;

// Field names match what the My Resumes screen uses
public record ResumeResponse(
        Long id,
        String fileName,
        LocalDateTime uploadedAt,
        int sizeKb,
        int interviewsUsed
) {}