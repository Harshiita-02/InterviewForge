package com.interviewforge.backend.service.impl;

import com.interviewforge.backend.dtos.feedbackReport.FeedbackReportResponse;
import com.interviewforge.backend.dtos.interview.InterviewAnswerRequest;
import com.interviewforge.backend.dtos.interview.InterviewAnswerResult;
import com.interviewforge.backend.dtos.interview.InterviewQuestionResponse;
import com.interviewforge.backend.dtos.interview.InterviewResultResponse;
import com.interviewforge.backend.dtos.interview.InterviewSessionInfo;
import com.interviewforge.backend.dtos.interview.InterviewStateResponse;
import com.interviewforge.backend.entity.Answer;
import com.interviewforge.backend.entity.InterviewSession;
import com.interviewforge.backend.entity.Question;
import com.interviewforge.backend.entity.enums.DifficultyLevel;
import com.interviewforge.backend.entity.enums.InterviewType;
import com.interviewforge.backend.entity.enums.SessionStatus;
import com.interviewforge.backend.exception.ConflictException;
import com.interviewforge.backend.exception.ResourceNotFoundException;
import com.interviewforge.backend.repository.AnswerRepository;
import com.interviewforge.backend.repository.FeedbackReportRepository;
import com.interviewforge.backend.repository.QuestionRepository;
import com.interviewforge.backend.security.SessionAccess;
import com.interviewforge.backend.service.FeedbackReportService;
import com.interviewforge.backend.service.GeminiService;
import com.interviewforge.backend.service.InterviewFlowService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InterviewFlowServiceImpl implements InterviewFlowService {

    private final SessionAccess sessionAccess;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final FeedbackReportRepository reportRepository;
    private final FeedbackReportService reportService;
    private final GeminiService geminiService;

    @Value("${interview.question-count:5}")
    private int totalQuestions;

    // ---------- GET /api/interviews/{id} ----------

    @Override
    @Transactional
    public InterviewStateResponse getState(Long sessionId) {
        InterviewSession session = sessionAccess.requireOwned(sessionId);
        InterviewSessionInfo info = new InterviewSessionInfo(
                session.getId(), session.getRole(), typeLabel(session.getInterviewType()));

        if (session.getStatus() != SessionStatus.IN_PROGRESS) {
            return new InterviewStateResponse(info, null);
        }

        List<Question> questions = questionRepository.findBySessionIdOrderBySequenceNoAsc(sessionId);

        // Resume at the first question that has no answer yet
        for (int i = 0; i < questions.size(); i++) {
            Question question = questions.get(i);
            if (answerRepository.findByQuestionId(question.getId()).isEmpty()) {
                Question previous = i > 0 ? questions.get(i - 1) : null;
                return new InterviewStateResponse(info, toDto(question, previous));
            }
        }

        // Everything asked so far is answered
        if (questions.size() >= totalQuestions) {
            finish(session);
            return new InterviewStateResponse(info, null);
        }

        Question previous = questions.isEmpty() ? null : questions.get(questions.size() - 1);
        Question next = createNextQuestion(session, questions);
        return new InterviewStateResponse(info, toDto(next, previous));
    }

    // ---------- POST /api/interviews/{id}/answers ----------

    @Override
    @Transactional
    public InterviewAnswerResult submitAnswer(Long sessionId, InterviewAnswerRequest request) {
        InterviewSession session = sessionAccess.requireOwned(sessionId);

        if (session.getStatus() != SessionStatus.IN_PROGRESS) {
            throw new ConflictException("This interview has already finished");
        }

        Question question = questionRepository.findById(request.questionId())
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        // The question must belong to THIS session
        if (!question.getSession().getId().equals(sessionId)) {
            throw new ResourceNotFoundException("Question not found");
        }

        if (answerRepository.findByQuestionId(question.getId()).isPresent()) {
            throw new ConflictException("This question has already been answered");
        }

        String text = request.text() == null ? "" : request.text().trim();

        GeminiService.EvaluationResult evaluation = text.isEmpty()
                ? new GeminiService.EvaluationResult(0, "No answer was given for this question.")
                : geminiService.evaluateAnswer(question.getQuestionText(), text);

        answerRepository.save(Answer.builder()
                .question(question)
                .answerText(text.isEmpty() ? "(no answer)" : text)
                .score(evaluation.score())
                .feedbackText(evaluation.feedback())
                .timeTakenSeconds(request.timeTakenSeconds())
                .evaluatedAt(LocalDateTime.now())
                .build());

        List<Question> questions = questionRepository.findBySessionIdOrderBySequenceNoAsc(sessionId);

        if (questions.size() >= totalQuestions) {
            finish(session);
            return new InterviewAnswerResult(null);
        }

        Question next = createNextQuestion(session, questions);
        return new InterviewAnswerResult(toDto(next, question));
    }

    // ---------- GET /api/interviews/{id}/result ----------

    @Override
    @Transactional
    public InterviewResultResponse getResult(Long sessionId) {
        InterviewSession session = sessionAccess.requireOwned(sessionId);

        if (session.getStatus() == SessionStatus.IN_PROGRESS) {
            throw new ConflictException("This interview is still in progress");
        }

        // The AI summary is generated the first time the result is opened
        FeedbackReportResponse report = reportRepository.findBySessionId(sessionId).isPresent()
                ? reportService.getBySessionId(sessionId)
                : reportService.generateReport(sessionId);

        List<Question> questions = questionRepository.findBySessionIdOrderBySequenceNoAsc(sessionId);

        List<InterviewResultResponse.QuestionResult> items = new ArrayList<>();
        for (Question question : questions) {
            Optional<Answer> found = answerRepository.findByQuestionId(question.getId());
            if (found.isEmpty()) {
                continue;   // unanswered questions are not listed
            }
            Answer answer = found.get();
            items.add(new InterviewResultResponse.QuestionResult(
                    question.getId(),
                    question.getSequenceNo(),
                    question.getQuestionText(),
                    question.isFollowUp(),
                    answer.getAnswerText(),
                    answer.getScore() != null ? answer.getScore() : 0,
                    answer.getFeedbackText() != null ? answer.getFeedbackText() : ""
            ));
        }

        Question last = questions.isEmpty() ? null : questions.get(questions.size() - 1);
        DifficultyLevel finalDifficulty = last != null ? last.getDifficulty() : session.getDifficulty();

        LocalDateTime end = session.getEndedAt() != null ? session.getEndedAt() : LocalDateTime.now();
        long minutes = Math.max(1, Duration.between(session.getStartedAt(), end).toMinutes());

        return new InterviewResultResponse(
                session.getId(),
                session.getRole(),
                typeLabel(session.getInterviewType()),
                difficultyLabel(finalDifficulty),
                end,
                report.overallScore() != null ? report.overallScore() : 0,
                items.size(),
                totalQuestions,
                minutes,
                report.summaryText() != null ? report.summaryText() : "",
                splitLines(report.strengths()),
                splitLines(report.weaknesses()),
                items
        );
    }

    // ---------- helpers ----------

    private void finish(InterviewSession session) {
        session.setStatus(SessionStatus.COMPLETED);
        if (session.getEndedAt() == null) {
            session.setEndedAt(LocalDateTime.now());
        }
    }

    // Builds and saves the next question, adapting to how the last answer went
    private Question createNextQuestion(InterviewSession session, List<Question> questions) {
        int sequence = questions.size() + 1;

        Question lastQuestion = questions.isEmpty() ? null : questions.get(questions.size() - 1);
        Answer lastAnswer = lastQuestion == null
                ? null
                : answerRepository.findByQuestionId(lastQuestion.getId()).orElse(null);

        DifficultyLevel current = lastQuestion != null ? lastQuestion.getDifficulty() : session.getDifficulty();
        DifficultyLevel next = lastAnswer != null ? adapt(current, lastAnswer.getScore()) : current;

        String previousSummary = null;
        if (lastQuestion != null && lastAnswer != null) {
            previousSummary = "Question: " + lastQuestion.getQuestionText()
                    + " | Candidate's answer: " + shorten(lastAnswer.getAnswerText(), 600)
                    + " | Score: " + Math.round(lastAnswer.getScore() != null ? lastAnswer.getScore() : 0) + "/100";
        }

        List<String> asked = questions.stream().map(Question::getQuestionText).toList();

        GeminiService.GeneratedQuestion generated =
                geminiService.generateNextQuestion(session, sequence, next, previousSummary, asked);

        return questionRepository.save(Question.builder()
                .session(session)
                .questionText(generated.text())
                .difficulty(next)
                .sequenceNo(sequence)
                .followUp(generated.followUp())
                .generatedBy(generated.source())
                .build());
    }

    // Strong answer (80+) raises the difficulty, weak answer (under 40) lowers it
    private DifficultyLevel adapt(DifficultyLevel current, Double score) {
        if (score == null) {
            return current;
        }
        if (score >= 80) {
            return switch (current) {
                case EASY -> DifficultyLevel.MEDIUM;
                case MEDIUM, HARD -> DifficultyLevel.HARD;
            };
        }
        if (score < 40) {
            return switch (current) {
                case HARD -> DifficultyLevel.MEDIUM;
                case MEDIUM, EASY -> DifficultyLevel.EASY;
            };
        }
        return current;
    }

    private InterviewQuestionResponse toDto(Question question, Question previous) {
        String note = null;
        if (previous != null && previous.getDifficulty() != question.getDifficulty()) {
            String from = difficultyLabel(previous.getDifficulty());
            String to = difficultyLabel(question.getDifficulty());
            note = rank(question.getDifficulty()) > rank(previous.getDifficulty())
                    ? "Difficulty raised from " + from + " to " + to + " because your last answer was strong."
                    : "Difficulty lowered from " + from + " to " + to + " to build on the basics.";
        }

        return new InterviewQuestionResponse(
                question.getId(),
                question.getQuestionText(),
                question.getSequenceNo(),
                totalQuestions,
                question.isFollowUp(),
                difficultyLabel(question.getDifficulty()),
                timeLimitSeconds(question.getDifficulty()),
                note
        );
    }

    private static int rank(DifficultyLevel level) {
        return switch (level) {
            case EASY -> 1;
            case MEDIUM -> 2;
            case HARD -> 3;
        };
    }

    private static int timeLimitSeconds(DifficultyLevel level) {
        return switch (level) {
            case EASY -> 90;
            case MEDIUM -> 120;
            case HARD -> 180;
        };
    }

    private static String difficultyLabel(DifficultyLevel level) {
        return switch (level) {
            case EASY -> "Easy";
            case MEDIUM -> "Medium";
            case HARD -> "Hard";
        };
    }

    private static String typeLabel(InterviewType type) {
        return switch (type) {
            case TECHNICAL -> "Technical";
            case HR -> "HR";
            case MIXED -> "Mixed";
        };
    }

    private static List<String> splitLines(String text) {
        if (text == null || text.isBlank()) {
            return List.of();
        }
        return Arrays.stream(text.split("\n"))
                .map(String::trim)
                .filter(line -> !line.isEmpty())
                .toList();
    }

    private static String shorten(String text, int max) {
        if (text == null) {
            return "";
        }
        return text.length() <= max ? text : text.substring(0, max);
    }
}