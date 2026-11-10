package com.interviewforge.backend.mapper;

import com.interviewforge.backend.dtos.question.AnswerResponse;
import com.interviewforge.backend.dtos.question.QuestionResponse;
import com.interviewforge.backend.entity.Answer;
import com.interviewforge.backend.entity.Question;
import org.springframework.stereotype.Component;

@Component
public class QuestionMapper {

    public QuestionResponse toResponse(Question question) {
        return new QuestionResponse(
                question.getId(),
                question.getQuestionText(),
                question.getDifficulty(),
                question.getSequenceNo(),
                question.getGeneratedBy()
        );
    }

    public AnswerResponse toAnswerResponse(Answer answer) {
        return new AnswerResponse(
                answer.getId(),
                answer.getQuestion().getId(),
                answer.getQuestion().getQuestionText(),
                answer.getAnswerText(),
                answer.getScore(),
                answer.getFeedbackText(),
                answer.getTimeTakenSeconds(),
                answer.getEvaluatedAt()
        );
    }
}