package com.interviewforge.backend.service;

import com.interviewforge.backend.dtos.feedbackReport.FeedbackReportResponse;

public interface FeedbackReportService {
    FeedbackReportResponse generateReport(Long sessionId);
    FeedbackReportResponse getBySessionId(Long sessionId);
}
