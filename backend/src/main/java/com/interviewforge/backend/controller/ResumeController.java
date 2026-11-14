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

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ResumeResponse> upload(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(resumeService.upload(file));
    }

    @GetMapping
    public ResponseEntity<List<ResumeResponse>> getMine() {
        return ResponseEntity.ok(resumeService.getMine());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        resumeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}