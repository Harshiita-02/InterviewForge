package com.interviewforge.backend.service.impl;

import com.interviewforge.backend.exception.ConflictException;
import com.interviewforge.backend.exception.ResourceNotFoundException;
import com.interviewforge.backend.dtos.template.CompanyTemplateCreateRequest;
import com.interviewforge.backend.dtos.template.CompanyTemplateResponse;
import com.interviewforge.backend.dtos.template.CompanyTemplateSummary;
import com.interviewforge.backend.entity.CompanyTemplate;
import com.interviewforge.backend.entity.Topic;
import com.interviewforge.backend.mapper.CompanyTemplateMapper;
import com.interviewforge.backend.repository.CompanyTemplateRepository;
import com.interviewforge.backend.repository.TopicRepository;
import com.interviewforge.backend.service.CompanyTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyTemplateServiceImpl implements CompanyTemplateService {

    private final CompanyTemplateRepository templateRepository;
    private final TopicRepository topicRepository;
    private final CompanyTemplateMapper templateMapper;

    @Override
    @Transactional
    public CompanyTemplateResponse create(CompanyTemplateCreateRequest request) {
        if (templateRepository.findByCompanyName(request.companyName()).isPresent()) {
            throw new ConflictException("Template for this company already exists");
        }

        Set<Topic> topics = new HashSet<>(topicRepository.findAllById(request.topicIds()));

        CompanyTemplate template = CompanyTemplate.builder()
                .companyName(request.companyName())
                .description(request.description())
                .topics(topics)
                .build();

        CompanyTemplate saved = templateRepository.save(template);
        return templateMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyTemplateResponse getById(Long id) {
        CompanyTemplate template = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company template not found"));
        return templateMapper.toResponse(template);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanyTemplateSummary> getAllSummaries() {
        return templateRepository.findAll().stream()
                .map(templateMapper::toSummary)
                .collect(Collectors.toList());
    }
}