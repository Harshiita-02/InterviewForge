package com.interviewforge.backend.controller;

import com.interviewforge.backend.dtos.resume.ResumeResponse;
import com.interviewforge.backend.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<ResumeResponse> upload(
            @RequestParam("userId") Long userId,
            @RequestParam("file") MultipartFile file
    ) {
        return ResponseEntity.ok(resumeService.upload(userId, file));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ResumeResponse>> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(resumeService.getByUserId(userId));
    }
}