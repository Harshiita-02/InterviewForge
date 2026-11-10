package com.interviewforge.backend.mapper;

import com.interviewforge.backend.dtos.session.SessionResponse;
import com.interviewforge.backend.entity.InterviewSession;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class SessionMapper {

    public SessionResponse toResponse(InterviewSession session) {
        return new SessionResponse(
                session.getId(),
                session.getUser().getId(),
                session.getCompanyTemplate() != null
                        ? session.getCompanyTemplate().getCompanyName()
                        : null,
                session.getRole(),
                session.getInterviewType(),
                session.getDifficulty(),
                session.getStatus(),
                session.getStartedAt(),
                session.getEndedAt(),
                session.getTopics().stream()
                        .map(topic -> topic.getName())
                        .collect(Collectors.toList())
        );
    }
}