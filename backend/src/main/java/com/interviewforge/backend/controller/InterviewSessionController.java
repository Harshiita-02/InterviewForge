package com.interviewforge.backend.controller;

import com.interviewforge.backend.dtos.session.SessionCreateRequest;
import com.interviewforge.backend.dtos.session.SessionResponse;
import com.interviewforge.backend.service.InterviewSessionService;
import jakarta.validation.Valid;
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
    public ResponseEntity<SessionResponse> create(@Valid @RequestBody SessionCreateRequest request) {
        return ResponseEntity.ok(sessionService.create(request));
    }

    @GetMapping("/me")
    public ResponseEntity<List<SessionResponse>> getMine() {
        return ResponseEntity.ok(sessionService.getMine());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SessionResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(sessionService.getById(id));
    }

    @PatchMapping("/{id}/end")
    public ResponseEntity<SessionResponse> endSession(@PathVariable Long id) {
        return ResponseEntity.ok(sessionService.endSession(id));
    }
}