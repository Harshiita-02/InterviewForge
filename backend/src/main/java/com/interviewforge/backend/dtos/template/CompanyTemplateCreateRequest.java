package com.interviewforge.backend.dtos.template;

import java.util.List;

public record CompanyTemplateCreateRequest(
        String companyName,
        String description,
        List<Long> topicIds
) {}