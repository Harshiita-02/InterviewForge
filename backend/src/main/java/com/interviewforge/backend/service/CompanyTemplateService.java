package com.interviewforge.backend.service;

import com.interviewforge.backend.dtos.template.CompanyTemplateCreateRequest;
import com.interviewforge.backend.dtos.template.CompanyTemplateResponse;
import com.interviewforge.backend.dtos.template.CompanyTemplateSummary;
import java.util.List;

public interface CompanyTemplateService {
    CompanyTemplateResponse create(CompanyTemplateCreateRequest request);
    CompanyTemplateResponse getById(Long id);
    List<CompanyTemplateSummary> getAllSummaries();
}