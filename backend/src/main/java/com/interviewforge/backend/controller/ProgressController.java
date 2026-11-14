package com.interviewforge.backend.controller;

import com.interviewforge.backend.dtos.progress.ProgressResponse;
import com.interviewforge.backend.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;

    @GetMapping
    public ResponseEntity<ProgressResponse> getProgress() {
        return ResponseEntity.ok(progressService.getProgress());
    }
}