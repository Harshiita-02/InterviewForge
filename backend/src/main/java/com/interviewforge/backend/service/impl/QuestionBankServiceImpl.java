package com.interviewforge.backend.service.impl;

import com.interviewforge.backend.entity.InterviewSession;
import com.interviewforge.backend.entity.enums.DifficultyLevel;
import com.interviewforge.backend.service.QuestionBankService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class QuestionBankServiceImpl implements QuestionBankService {

    // A minimal static bank, keyed by difficulty — enough to keep the app
    // functional if Gemini is unreachable. Expand per topic/role over time.
    private static final Map<DifficultyLevel, List<String>> FALLBACK_QUESTIONS = Map.of(
            DifficultyLevel.EASY, List.of(
                    "Tell me about a project you're proud of and why.",
                    "What is the difference between an array and a linked list?"
            ),
            DifficultyLevel.MEDIUM, List.of(
                    "Explain how you would design a URL shortening service.",
                    "Describe a time you had to debug a difficult production issue."
            ),
            DifficultyLevel.HARD, List.of(
                    "Design a rate limiter for a high-traffic API.",
                    "How would you handle eventual consistency in a distributed system?"
            )
    );

    @Override
    public String getFallbackQuestion(InterviewSession session, DifficultyLevel difficulty, int sequenceNo) {
        List<String> pool = FALLBACK_QUESTIONS.getOrDefault(difficulty, FALLBACK_QUESTIONS.get(DifficultyLevel.MEDIUM));
        return pool.get(ThreadLocalRandom.current().nextInt(pool.size()));
    }
}