package com.interviewforge.backend.service;

import com.interviewforge.backend.entity.InterviewSession;
import com.interviewforge.backend.entity.Question;
import com.interviewforge.backend.entity.enums.DifficultyLevel;
import com.interviewforge.backend.entity.enums.QuestionSource;

import java.util.List;

public interface GeminiService {

    // kept for the older /api/questions endpoints
    Question generateQuestion(InterviewSession session, int sequenceNo);

    GeneratedQuestion generateNextQuestion(
            InterviewSession session,
            int sequenceNo,
            DifficultyLevel difficulty,
            String previousAnswerSummary,
            List<String> askedQuestions
    );

    EvaluationResult evaluateAnswer(String questionText, String answerText);

    ReportSummary summarizeInterview(InterviewSession session, List<QuestionFeedback> items);

    record EvaluationResult(double score, String feedback) {}

    record GeneratedQuestion(String text, boolean followUp, QuestionSource source) {}

    record QuestionFeedback(int number, String question, String answer, double score) {}

    record ReportSummary(String summary, List<String> strengths, List<String> improvements) {}
}