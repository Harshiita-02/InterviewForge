package com.interviewforge.backend.service.impl;

import com.interviewforge.backend.exception.ResourceNotFoundException;
import com.interviewforge.backend.dtos.session.SessionCreateRequest;
import com.interviewforge.backend.dtos.session.SessionResponse;
import com.interviewforge.backend.entity.*;
import com.interviewforge.backend.entity.enums.SessionStatus;
import com.interviewforge.backend.mapper.SessionMapper;
import com.interviewforge.backend.repository.*;
import com.interviewforge.backend.service.InterviewSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterviewSessionServiceImpl implements InterviewSessionService {

    private final InterviewSessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final CompanyTemplateRepository companyTemplateRepository;
    private final TopicRepository topicRepository;
    private final SessionMapper sessionMapper;

    @Override
    @Transactional
    public SessionResponse create(SessionCreateRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CompanyTemplate template = null;
        if (request.companyTemplateId() != null) {
            template = companyTemplateRepository.findById(request.companyTemplateId())
                    .orElseThrow(() -> new ResourceNotFoundException("Company template not found"));
        }

        Set<Topic> topics = new HashSet<>(topicRepository.findAllById(request.topicIds()));

        InterviewSession session = InterviewSession.builder()
                .user(user)
                .companyTemplate(template)
                .role(request.role())
                .interviewType(request.interviewType())
                .difficulty(request.difficulty())
                .topics(topics)
                .build();

        InterviewSession saved = sessionRepository.save(session);
        return sessionMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public SessionResponse getById(Long id) {
        InterviewSession session = sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
        return sessionMapper.toResponse(session);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionResponse> getByUserId(Long userId) {
        return sessionRepository.findByUserIdOrderByStartedAtDesc(userId).stream()
                .map(sessionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SessionResponse endSession(Long id) {
        InterviewSession session = sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        session.setStatus(SessionStatus.COMPLETED);
        session.setEndedAt(LocalDateTime.now());

        return sessionMapper.toResponse(session);
    }
}