package com.interviewforge.backend.service.impl;

import com.interviewforge.backend.exception.ConflictException;
import com.interviewforge.backend.exception.ResourceNotFoundException;
import com.interviewforge.backend.dtos.feedbackReport.FeedbackReportResponse;
import com.interviewforge.backend.entity.Answer;
import com.interviewforge.backend.entity.FeedbackReport;
import com.interviewforge.backend.entity.InterviewSession;
import com.interviewforge.backend.entity.Question;
import com.interviewforge.backend.mapper.FeedbackReportMapper;
import com.interviewforge.backend.repository.AnswerRepository;
import com.interviewforge.backend.repository.FeedbackReportRepository;
import com.interviewforge.backend.repository.InterviewSessionRepository;
import com.interviewforge.backend.repository.QuestionRepository;
import com.interviewforge.backend.service.FeedbackReportService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedbackReportServiceImpl implements FeedbackReportService {

    private final FeedbackReportRepository reportRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final InterviewSessionRepository sessionRepository;
    private final FeedbackReportMapper reportMapper;

    @Override
    @Transactional
    public FeedbackReportResponse generateReport(Long sessionId) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        if (reportRepository.findBySessionId(sessionId).isPresent()) {
            throw new ConflictException("Report already generated for this session");
        }

        List<Question> questions = questionRepository.findBySessionIdOrderBySequenceNoAsc(sessionId);

        List<Answer> answers = questions.stream()
                .map(q -> answerRepository.findByQuestionId(q.getId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());

        double overallScore = answers.stream()
                .mapToDouble(a -> a.getScore() != null ? a.getScore() : 0)
                .average()
                .orElse(0);

        // simple threshold-based strengths/weaknesses for now — a good
        // candidate to later hand off to Gemini for a richer written summary
        String strengths = answers.stream()
                .filter(a -> a.getScore() != null && a.getScore() >= 70)
                .map(a -> a.getQuestion().getQuestionText())
                .collect(Collectors.joining("; "));

        String weaknesses = answers.stream()
                .filter(a -> a.getScore() != null && a.getScore() < 70)
                .map(a -> a.getQuestion().getQuestionText())
                .collect(Collectors.joining("; "));

        FeedbackReport report = FeedbackReport.builder()
                .session(session)
                .overallScore(overallScore)
                .strengths(strengths.isBlank() ? "None identified" : strengths)
                .weaknesses(weaknesses.isBlank() ? "None identified" : weaknesses)
                .summaryText("Completed " + answers.size() + " of " + questions.size() + " questions.")
                .build();

        FeedbackReport saved = reportRepository.save(report);
        return reportMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public FeedbackReportResponse getBySessionId(Long sessionId) {
        FeedbackReport report = reportRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        return reportMapper.toResponse(report);
    }
}