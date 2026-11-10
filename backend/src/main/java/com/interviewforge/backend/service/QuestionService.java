package com.interviewforge.backend.service;

import com.interviewforge.backend.dtos.question.AnswerResponse;
import com.interviewforge.backend.dtos.question.AnswerSubmitRequest;
import com.interviewforge.backend.dtos.question.QuestionResponse;
import java.util.List;

public interface QuestionService {
    QuestionResponse generateNextQuestion(Long sessionId);
    List<QuestionResponse> getBySessionId(Long sessionId);
    AnswerResponse submitAnswer(AnswerSubmitRequest request);
}