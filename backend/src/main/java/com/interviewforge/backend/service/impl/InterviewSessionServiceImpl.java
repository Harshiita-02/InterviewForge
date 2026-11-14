package com.interviewforge.backend.service.impl;

import com.interviewforge.backend.dtos.session.SessionCreateRequest;
import com.interviewforge.backend.dtos.session.SessionResponse;
import com.interviewforge.backend.entity.CompanyTemplate;
import com.interviewforge.backend.entity.InterviewSession;
import com.interviewforge.backend.entity.Resume;
import com.interviewforge.backend.entity.Topic;
import com.interviewforge.backend.entity.User;
import com.interviewforge.backend.entity.enums.SessionStatus;
import com.interviewforge.backend.exception.ResourceNotFoundException;
import com.interviewforge.backend.mapper.SessionMapper;
import com.interviewforge.backend.repository.CompanyTemplateRepository;
import com.interviewforge.backend.repository.InterviewSessionRepository;
import com.interviewforge.backend.repository.ResumeRepository;
import com.interviewforge.backend.repository.TopicRepository;
import com.interviewforge.backend.repository.UserRepository;
import com.interviewforge.backend.security.CurrentUser;
import com.interviewforge.backend.security.SessionAccess;
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
    private final ResumeRepository resumeRepository;
    private final SessionMapper sessionMapper;
    private final CurrentUser currentUser;
    private final SessionAccess sessionAccess;

    @Override
    @Transactional
    public SessionResponse create(SessionCreateRequest request) {
        User user = userRepository.findById(currentUser.id())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CompanyTemplate template = null;
        if (request.companyTemplateId() != null) {
            template = companyTemplateRepository.findById(request.companyTemplateId())
                    .orElseThrow(() -> new ResourceNotFoundException("Company template not found"));
        }

        // The resume must belong to the logged-in user
        Resume resume = null;
        if (request.resumeId() != null) {
            resume = resumeRepository.findById(request.resumeId())
                    .filter(r -> r.getUser().getId().equals(user.getId()))
                    .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));
        }

        InterviewSession session = InterviewSession.builder()
                .user(user)
                .companyTemplate(template)
                .resume(resume)
                .role(request.role().trim())
                .interviewType(request.interviewType())
                .difficulty(request.difficulty())
                .topics(resolveTopics(request.topics()))
                .build();

        InterviewSession saved = sessionRepository.save(session);
        return sessionMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public SessionResponse getById(Long id) {
        return sessionMapper.toResponse(sessionAccess.requireOwned(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionResponse> getMine() {
        return sessionRepository.findByUserIdOrderByStartedAtDesc(currentUser.id()).stream()
                .map(sessionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SessionResponse endSession(Long id) {
        InterviewSession session = sessionAccess.requireOwned(id);
        session.setStatus(SessionStatus.COMPLETED);
        session.setEndedAt(LocalDateTime.now());
        return sessionMapper.toResponse(session);
    }

    // Finds each topic by name, creating it (as a custom topic) when it doesn't exist yet
    private Set<Topic> resolveTopics(List<String> names) {
        Set<Topic> topics = new HashSet<>();
        if (names == null) {
            return topics;
        }

        for (String raw : names) {
            if (raw == null || raw.isBlank()) {
                continue;
            }
            String trimmed = raw.trim();
            String name = trimmed.length() > 100 ? trimmed.substring(0, 100) : trimmed;

            Topic topic = topicRepository.findByName(name)
                    .orElseGet(() -> topicRepository.save(
                            Topic.builder().name(name).isPredefined(false).build()));
            topics.add(topic);
        }
        return topics;
    }
}