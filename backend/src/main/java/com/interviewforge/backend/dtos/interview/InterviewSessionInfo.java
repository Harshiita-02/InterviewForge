package com.interviewforge.backend.dtos.interview;

public record InterviewSessionInfo(
        Long id,
        String role,
        String type    // "Technical" | "HR" | "Mixed"
) {}