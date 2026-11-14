package com.interviewforge.backend.service;

import com.interviewforge.backend.dtos.interview.InterviewAnswerRequest;
import com.interviewforge.backend.dtos.interview.InterviewAnswerResult;
import com.interviewforge.backend.dtos.interview.InterviewResultResponse;
import com.interviewforge.backend.dtos.interview.InterviewStateResponse;

public interface InterviewFlowService {
    InterviewStateResponse getState(Long sessionId);
    InterviewAnswerResult submitAnswer(Long sessionId, InterviewAnswerRequest request);
    InterviewResultResponse getResult(Long sessionId);
}