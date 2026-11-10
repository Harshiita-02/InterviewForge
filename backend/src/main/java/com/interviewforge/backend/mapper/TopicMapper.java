package com.interviewforge.backend.mapper;

import com.interviewforge.backend.dtos.topic.TopicResponse;
import com.interviewforge.backend.entity.Topic;
import org.springframework.stereotype.Component;

@Component
public class TopicMapper {

    public TopicResponse toResponse(Topic topic) {
        return new TopicResponse(
                topic.getId(),
                topic.getName(),
                topic.isPredefined()
        );
    }
}