package com.interviewforge.backend.controller;

import com.interviewforge.backend.dtos.session.SessionCreateRequest;
import com.interviewforge.backend.dtos.session.SessionResponse;
import com.interviewforge.backend.service.InterviewSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class InterviewSessionController {

    private final InterviewSessionService sessionService;

    @PostMapping
    public ResponseEntity<SessionResponse> create(@RequestBody SessionCreateRequest request) {
        return ResponseEntity.ok(sessionService.create(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SessionResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(sessionService.getById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SessionResponse>> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(sessionService.getByUserId(userId));
    }

    @PatchMapping("/{id}/end")
    public ResponseEntity<SessionResponse> endSession(@PathVariable Long id) {
        return ResponseEntity.ok(sessionService.endSession(id));
    }
}