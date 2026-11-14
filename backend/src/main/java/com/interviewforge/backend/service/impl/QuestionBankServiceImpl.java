package com.interviewforge.backend.service.impl;

import com.interviewforge.backend.entity.InterviewSession;
import com.interviewforge.backend.entity.enums.DifficultyLevel;
import com.interviewforge.backend.service.QuestionBankService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class QuestionBankServiceImpl implements QuestionBankService {

    // Used only when Gemini is unreachable. Five per level, so a 5-question
    // interview never repeats a question.
    private static final Map<DifficultyLevel, List<String>> FALLBACK_QUESTIONS = Map.of(
            DifficultyLevel.EASY, List.of(
                    "Tell me about a project you're proud of and why.",
                    "What is the difference between an array and a linked list?",
                    "What is object-oriented programming, and what are its four main principles?",
                    "What is the difference between SQL and NoSQL databases?",
                    "How do you approach learning a new technology?"
            ),
            DifficultyLevel.MEDIUM, List.of(
                    "Explain how you would design a URL shortening service.",
                    "Describe a time you had to debug a difficult production issue.",
                    "What is the difference between an abstract class and an interface?",
                    "Explain database indexing and when it can hurt performance.",
                    "How does a HashMap work internally, and what happens on a collision?"
            ),
            DifficultyLevel.HARD, List.of(
                    "Design a rate limiter for a high-traffic API.",
                    "How would you handle eventual consistency in a distributed system?",
                    "Explain how you would design a notification system that scales to millions of users.",
                    "How would you find and fix a memory leak in a long-running Java service?",
                    "Compare optimistic and pessimistic locking, and when you would choose each."
            )
    );

    @Override
    public String getFallbackQuestion(InterviewSession session, DifficultyLevel difficulty, int sequenceNo) {
        List<String> pool = FALLBACK_QUESTIONS.getOrDefault(difficulty, FALLBACK_QUESTIONS.get(DifficultyLevel.MEDIUM));
        return pool.get((sequenceNo - 1) % pool.size());
    }
}