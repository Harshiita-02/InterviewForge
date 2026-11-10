package com.interviewforge.backend.controller;

import com.interviewforge.backend.dtos.template.CompanyTemplateCreateRequest;
import com.interviewforge.backend.dtos.template.CompanyTemplateResponse;
import com.interviewforge.backend.dtos.template.CompanyTemplateSummary;
import com.interviewforge.backend.service.CompanyTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/templates")
@RequiredArgsConstructor
public class CompanyTemplateController {

    private final CompanyTemplateService templateService;

    @PostMapping
    public ResponseEntity<CompanyTemplateResponse> create(@RequestBody CompanyTemplateCreateRequest request) {
        return ResponseEntity.ok(templateService.create(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyTemplateResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(templateService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<CompanyTemplateSummary>> getAll() {
        return ResponseEntity.ok(templateService.getAllSummaries());
    }
}