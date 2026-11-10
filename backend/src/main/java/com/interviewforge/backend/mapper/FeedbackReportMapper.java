package com.interviewforge.backend.mapper;

import com.interviewforge.backend.dtos.feedbackReport.FeedbackReportResponse;
import com.interviewforge.backend.entity.FeedbackReport;
import org.springframework.stereotype.Component;

    @Component
    public class FeedbackReportMapper {
        public FeedbackReportResponse toResponse(FeedbackReport report) {
            return new FeedbackReportResponse(
                    report.getId(),
                    report.getSession().getId(),
                    report.getOverallScore(),
                    report.getStrengths(),
                    report.getWeaknesses(),
                    report.getSummaryText(),
                    report.getCreatedAt()
            );
        }
    }

