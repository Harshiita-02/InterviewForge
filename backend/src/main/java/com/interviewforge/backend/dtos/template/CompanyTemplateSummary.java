package com.interviewforge.backend.dtos.template;

import java.util.List;

public record CompanyTemplateSummary(
        Long id,
        String companyName,
        List<String> topicNames
) {}