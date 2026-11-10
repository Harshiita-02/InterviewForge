package com.interviewforge.backend.service;

import com.interviewforge.backend.entity.InterviewSession;
import com.interviewforge.backend.entity.Question;

public interface GeminiService {
    Question generateQuestion(InterviewSession session, int sequenceNo);
    EvaluationResult evaluateAnswer(String questionText, String answerText);

    record EvaluationResult(double score, String feedback) {}
}