package com.interviewforge.backend.mapper;

import com.interviewforge.backend.dtos.template.CompanyTemplateResponse;
import com.interviewforge.backend.dtos.template.CompanyTemplateSummary;
import com.interviewforge.backend.entity.CompanyTemplate;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class CompanyTemplateMapper {

    public CompanyTemplateResponse toResponse(CompanyTemplate template) {
        return new CompanyTemplateResponse(
                template.getId(),
                template.getCompanyName(),
                template.getDescription(),
                template.getTopics().stream()
                        .map(topic -> topic.getName())
                        .collect(Collectors.toList())
        );
    }

    public CompanyTemplateSummary toSummary(CompanyTemplate template) {
        return new CompanyTemplateSummary(
                template.getId(),
                template.getCompanyName()
        );
    }
}