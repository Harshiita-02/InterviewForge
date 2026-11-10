package com.interviewforge.backend.controller;

import com.interviewforge.backend.dtos.topic.TopicCreateRequest;
import com.interviewforge.backend.dtos.topic.TopicResponse;
import com.interviewforge.backend.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService;

    @PostMapping
    public ResponseEntity<TopicResponse> createCustomTopic(@RequestBody TopicCreateRequest request) {
        return ResponseEntity.ok(topicService.createCustomTopic(request));
    }

    @GetMapping
    public ResponseEntity<List<TopicResponse>> getAll() {
        return ResponseEntity.ok(topicService.getAll());
    }

    @GetMapping("/predefined")
    public ResponseEntity<List<TopicResponse>> getPredefined() {
        return ResponseEntity.ok(topicService.getPredefined());
    }
}