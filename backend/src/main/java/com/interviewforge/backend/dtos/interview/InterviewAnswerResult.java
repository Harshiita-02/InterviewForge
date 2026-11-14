package com.interviewforge.backend.dtos.interview;

// nextQuestion is null after the last question
public record InterviewAnswerResult(InterviewQuestionResponse nextQuestion) {}