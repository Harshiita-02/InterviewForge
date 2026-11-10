package com.interviewforge.backend.dtos.topic;

public record TopicResponse(
        Long id,
        String name,
        boolean isPredefined
) {}