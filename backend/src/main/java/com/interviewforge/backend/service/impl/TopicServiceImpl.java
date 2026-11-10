package com.interviewforge.backend.service.impl;

import com.interviewforge.backend.exception.ConflictException;
import com.interviewforge.backend.dtos.topic.TopicCreateRequest;
import com.interviewforge.backend.dtos.topic.TopicResponse;
import com.interviewforge.backend.entity.Topic;
import com.interviewforge.backend.mapper.TopicMapper;
import com.interviewforge.backend.repository.TopicRepository;
import com.interviewforge.backend.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TopicServiceImpl implements TopicService {

    private final TopicRepository topicRepository;
    private final TopicMapper topicMapper;

    @Override
    @Transactional
    public TopicResponse createCustomTopic(TopicCreateRequest request) {
        if (topicRepository.existsByName(request.name())) {
            throw new ConflictException("Topic already exists");
        }

        Topic topic = Topic.builder()
                .name(request.name())
                .isPredefined(false)   // hardcoded — never trusted from the client, see DTO note above
                .build();

        Topic saved = topicRepository.save(topic);
        return topicMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TopicResponse> getAll() {
        return topicRepository.findAll().stream()
                .map(topicMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TopicResponse> getPredefined() {
        return topicRepository.findAll().stream()
                .filter(Topic::isPredefined)
                .map(topicMapper::toResponse)
                .collect(Collectors.toList());
    }
}