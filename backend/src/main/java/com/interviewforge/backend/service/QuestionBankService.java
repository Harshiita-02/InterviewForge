package com.interviewforge.backend.service;

import com.interviewforge.backend.entity.InterviewSession;
import com.interviewforge.backend.entity.enums.DifficultyLevel;

public interface QuestionBankService {
    String getFallbackQuestion(InterviewSession session, DifficultyLevel difficulty, int sequenceNo);
}