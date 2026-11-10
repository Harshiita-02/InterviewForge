package com.interviewforge.backend.service;

import com.interviewforge.backend.dtos.session.SessionCreateRequest;
import com.interviewforge.backend.dtos.session.SessionResponse;
import java.util.List;

public interface InterviewSessionService {
    SessionResponse create(SessionCreateRequest request);
    SessionResponse getById(Long id);
    List<SessionResponse> getByUserId(Long userId);
    SessionResponse endSession(Long id);
}