package com.interviewforge.backend.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewforge.backend.entity.InterviewSession;
import com.interviewforge.backend.entity.Question;
import com.interviewforge.backend.entity.enums.QuestionSource;
import com.interviewforge.backend.service.GeminiService;
import com.interviewforge.backend.service.QuestionBankService;
import com.interviewforge.backend.service.gemini.GeminiPromptBuilder;
import com.interviewforge.backend.service.gemini.GeminiRequest;
import com.interviewforge.backend.service.gemini.GeminiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeminiServiceImpl implements GeminiService {

    private final WebClient geminiWebClient;
    private final QuestionBankService questionBankService;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model:gemini-1.5-flash}")
    private String model;

    private static final Duration TIMEOUT = Duration.ofSeconds(10);

    @Override
    public Question generateQuestion(InterviewSession session, int sequenceNo) {
        String prompt = GeminiPromptBuilder.buildQuestionPrompt(session, sequenceNo, null);

        try {
            String questionText = callGemini(prompt);

            return Question.builder()
                    .session(session)
                    .questionText(questionText)
                    .difficulty(session.getDifficulty())
                    .sequenceNo(sequenceNo)
                    .generatedBy(QuestionSource.GEMINI)
                    .build();

        } catch (Exception e) {
            log.warn("Gemini call failed, falling back to question bank. Reason: {}", e.getMessage());

            String fallbackText = questionBankService.getFallbackQuestion(
                    session, session.getDifficulty(), sequenceNo);

            return Question.builder()
                    .session(session)
                    .questionText(fallbackText)
                    .difficulty(session.getDifficulty())
                    .sequenceNo(sequenceNo)
                    .generatedBy(QuestionSource.QUESTION_BANK)
                    .build();
        }
    }

    @Override
    public EvaluationResult evaluateAnswer(String questionText, String answerText) {
        String prompt = GeminiPromptBuilder.buildEvaluationPrompt(questionText, answerText);

        try {
            String rawJson = callGemini(prompt);
            JsonNode node = objectMapper.readTree(rawJson);
            return new EvaluationResult(node.get("score").asDouble(), node.get("feedback").asText());

        } catch (Exception e) {
            log.warn("Gemini evaluation failed: {}", e.getMessage());
            // A neutral, honest fallback score rather than pretending evaluation succeeded
            return new EvaluationResult(0, "Automatic evaluation was unavailable for this answer.");
        }
    }

    private String callGemini(String prompt) {
        GeminiResponse response = geminiWebClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/models/{model}:generateContent")
                        .queryParam("key", apiKey)
                        .build(model))
                .bodyValue(GeminiRequest.of(prompt))
                .retrieve()
                .bodyToMono(GeminiResponse.class)
                .timeout(TIMEOUT)
                .block();

        String text = response != null ? response.extractText() : null;

        if (text == null || text.isBlank()) {
            throw new IllegalStateException("Gemini returned an empty response");
        }

        return text.trim();
    }
}