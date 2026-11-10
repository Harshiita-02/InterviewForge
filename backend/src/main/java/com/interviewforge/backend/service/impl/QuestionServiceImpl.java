package com.interviewforge.backend.service.impl;

import com.interviewforge.backend.exception.ConflictException;
import com.interviewforge.backend.exception.ResourceNotFoundException;
import com.interviewforge.backend.dtos.question.AnswerResponse;
import com.interviewforge.backend.dtos.question.AnswerSubmitRequest;
import com.interviewforge.backend.dtos.question.QuestionResponse;
import com.interviewforge.backend.entity.Answer;
import com.interviewforge.backend.entity.InterviewSession;
import com.interviewforge.backend.entity.Question;
import com.interviewforge.backend.mapper.QuestionMapper;
import com.interviewforge.backend.repository.AnswerRepository;
import com.interviewforge.backend.repository.InterviewSessionRepository;
import com.interviewforge.backend.repository.QuestionRepository;
import com.interviewforge.backend.service.GeminiService;
import com.interviewforge.backend.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final InterviewSessionRepository sessionRepository;
    private final QuestionMapper questionMapper;
    private final GeminiService geminiService;   // the only class allowed to call Gemini

    @Override
    @Transactional
    public QuestionResponse generateNextQuestion(Long sessionId) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        int nextSequence = questionRepository.findBySessionIdOrderBySequenceNoAsc(sessionId).size() + 1;

        // GeminiService internally handles the Gemini call + fallback to
        // QuestionBankService, and returns which source actually produced it
        Question question = geminiService.generateQuestion(session, nextSequence);

        Question saved = questionRepository.save(question);
        return questionMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuestionResponse> getBySessionId(Long sessionId) {
        return questionRepository.findBySessionIdOrderBySequenceNoAsc(sessionId).stream()
                .map(questionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AnswerResponse submitAnswer(AnswerSubmitRequest request) {
        Question question = questionRepository.findById(request.questionId())
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        if (answerRepository.findByQuestionId(question.getId()).isPresent()) {
            throw new ConflictException("This question has already been answered");
        }

        Answer answer = Answer.builder()
                .question(question)
                .answerText(request.answerText())
                .timeTakenSeconds(request.timeTakenSeconds())
                .build();

        Answer saved = answerRepository.save(answer);

        // Evaluation (score + feedbackText + evaluatedAt) happens via a
        // separate async/follow-up call into GeminiService — deliberately
        // not shown here since GeminiService itself hasn't been built yet
        return questionMapper.toAnswerResponse(saved);
    }
}