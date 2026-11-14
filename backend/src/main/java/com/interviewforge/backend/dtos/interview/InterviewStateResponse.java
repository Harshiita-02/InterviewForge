package com.interviewforge.backend.dtos.interview;

// question is null when the interview is already finished
public record InterviewStateResponse(
        InterviewSessionInfo session,
        InterviewQuestionResponse question
) {}