package com.interviewforge.backend.dtos.template;

import java.util.List;

public record CompanyTemplateResponse(
        Long id,
        String companyName,
        String description,
        List<String> topicNames
) {}