package com.interviewforge.backend.service;

import com.interviewforge.backend.dtos.topic.TopicCreateRequest;
import com.interviewforge.backend.dtos.topic.TopicResponse;
import java.util.List;

public interface TopicService {
    TopicResponse createCustomTopic(TopicCreateRequest request);
    List<TopicResponse> getAll();
    List<TopicResponse> getPredefined();
}