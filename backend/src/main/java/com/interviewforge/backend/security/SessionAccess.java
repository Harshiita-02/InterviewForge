package com.interviewforge.backend.security;

import com.interviewforge.backend.entity.InterviewSession;
import com.interviewforge.backend.exception.ResourceNotFoundException;
import com.interviewforge.backend.repository.InterviewSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SessionAccess {

    private final InterviewSessionRepository sessionRepository;
    private final CurrentUser currentUser;

    // Returns the session only if it belongs to the logged-in user.
    // Missing and not-yours both give the same 404, so IDs can't be probed.
    public InterviewSession requireOwned(Long sessionId) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        if (!session.getUser().getId().equals(currentUser.id())) {
            throw new ResourceNotFoundException("Session not found");
        }
        return session;
    }
}