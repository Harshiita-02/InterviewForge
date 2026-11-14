package com.interviewforge.backend.service.impl;

import com.interviewforge.backend.dtos.feedbackReport.FeedbackReportResponse;
import com.interviewforge.backend.entity.Answer;
import com.interviewforge.backend.entity.FeedbackReport;
import com.interviewforge.backend.entity.InterviewSession;
import com.interviewforge.backend.entity.Question;
import com.interviewforge.backend.exception.ConflictException;
import com.interviewforge.backend.exception.ResourceNotFoundException;
import com.interviewforge.backend.mapper.FeedbackReportMapper;
import com.interviewforge.backend.repository.AnswerRepository;
import com.interviewforge.backend.repository.FeedbackReportRepository;
import com.interviewforge.backend.repository.QuestionRepository;
import com.interviewforge.backend.security.SessionAccess;
import com.interviewforge.backend.service.FeedbackReportService;
import com.interviewforge.backend.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FeedbackReportServiceImpl implements FeedbackReportService {

    private final FeedbackReportRepository reportRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final FeedbackReportMapper reportMapper;
    private final SessionAccess sessionAccess;
    private final GeminiService geminiService;

    @Override
    @Transactional
    public FeedbackReportResponse generateReport(Long sessionId) {
        InterviewSession session = sessionAccess.requireOwned(sessionId);

        if (reportRepository.findBySessionId(sessionId).isPresent()) {
            throw new ConflictException("Report already generated for this session");
        }

        List<Question> questions = questionRepository.findBySessionIdOrderBySequenceNoAsc(sessionId);

        List<GeminiService.QuestionFeedback> items = new ArrayList<>();
        double totalScore = 0;

        for (Question question : questions) {
            Optional<Answer> found = answerRepository.findByQuestionId(question.getId());
            if (found.isEmpty()) {
                continue;
            }
            Answer answer = found.get();
            double score = answer.getScore() != null ? answer.getScore() : 0;
            totalScore += score;
            items.add(new GeminiService.QuestionFeedback(
                    question.getSequenceNo(), question.getQuestionText(), answer.getAnswerText(), score));
        }

        double overallScore = items.isEmpty()
                ? 0
                : Math.round(totalScore / items.size() * 10.0) / 10.0;

        GeminiService.ReportSummary summary = items.isEmpty()
                ? new GeminiService.ReportSummary("No questions were answered in this interview.", List.of(), List.of())
                : geminiService.summarizeInterview(session, items);

        FeedbackReport report = FeedbackReport.builder()
                .session(session)
                .overallScore(overallScore)
                .strengths(String.join("\n", summary.strengths()))
                .weaknesses(String.join("\n", summary.improvements()))   // "improvements" are stored as weaknesses
                .summaryText(summary.summary())
                .build();

        FeedbackReport saved = reportRepository.save(report);
        return reportMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public FeedbackReportResponse getBySessionId(Long sessionId) {
        sessionAccess.requireOwned(sessionId);

        FeedbackReport report = reportRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        return reportMapper.toResponse(report);
    }
}