package com.interviewforge.backend.service.impl;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.interviewforge.backend.entity.InterviewSession;
import com.interviewforge.backend.entity.Question;
import com.interviewforge.backend.entity.enums.DifficultyLevel;
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
import tools.jackson.databind.json.JsonMapper;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeminiServiceImpl implements GeminiService {

    private final WebClient geminiWebClient;
    private final QuestionBankService questionBankService;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model:gemini-3.5-flash-lite}")
    private String model;

    @Value("${gemini.fallback-model:gemini-3.1-flash-lite}")
    private String fallbackModel;

    private static final Duration TIMEOUT = Duration.ofSeconds(15);
    private static final JsonMapper MAPPER = JsonMapper.builder().build();

    // ---- shapes of the JSON that Gemini is asked to return ----
    @JsonIgnoreProperties(ignoreUnknown = true)
    private record QuestionPayload(String question, boolean followUp) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record EvaluationPayload(double score, String feedback) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record SummaryPayload(String summary, List<String> strengths, List<String> improvements) {}

    @Override
    public Question generateQuestion(InterviewSession session, int sequenceNo) {
        GeneratedQuestion generated = generateNextQuestion(
                session, sequenceNo, session.getDifficulty(), null, List.of());

        return Question.builder()
                .session(session)
                .questionText(generated.text())
                .difficulty(session.getDifficulty())
                .sequenceNo(sequenceNo)
                .followUp(generated.followUp())
                .generatedBy(generated.source())
                .build();
    }

    @Override
    public GeneratedQuestion generateNextQuestion(
            InterviewSession session,
            int sequenceNo,
            DifficultyLevel difficulty,
            String previousAnswerSummary,
            List<String> askedQuestions
    ) {
        String prompt = GeminiPromptBuilder.buildQuestionPrompt(
                session, sequenceNo, difficulty, previousAnswerSummary, askedQuestions);

        try {
            String raw = callGemini(prompt, true);
            QuestionPayload payload = MAPPER.readValue(cleanJson(raw), QuestionPayload.class);

            if (payload.question() == null || payload.question().isBlank()) {
                throw new IllegalStateException("Gemini returned no question");
            }

            boolean followUp = payload.followUp() && previousAnswerSummary != null;
            return new GeneratedQuestion(payload.question().trim(), followUp, QuestionSource.GEMINI);

        } catch (Exception e) {
            log.warn("Gemini question call failed, falling back to question bank. Reason: {}", e.getMessage());

            String fallback = questionBankService.getFallbackQuestion(session, difficulty, sequenceNo);
            return new GeneratedQuestion(fallback, false, QuestionSource.QUESTION_BANK);
        }
    }

    @Override
    public EvaluationResult evaluateAnswer(String questionText, String answerText) {
        String prompt = GeminiPromptBuilder.buildEvaluationPrompt(questionText, answerText);

        try {
            String raw = callGemini(prompt, true);
            EvaluationPayload payload = MAPPER.readValue(cleanJson(raw), EvaluationPayload.class);

            double score = Math.max(0, Math.min(100, payload.score()));
            String feedback = (payload.feedback() == null || payload.feedback().isBlank())
                    ? "No written feedback was returned."
                    : payload.feedback().trim();

            return new EvaluationResult(score, feedback);

        } catch (Exception e) {
            log.warn("Gemini evaluation failed, using a length-based estimate. Reason: {}", e.getMessage());
            return estimateFromLength(answerText);
        }
    }

    @Override
    public ReportSummary summarizeInterview(InterviewSession session, List<QuestionFeedback> items) {
        String prompt = GeminiPromptBuilder.buildSummaryPrompt(session, items);

        try {
            String raw = callGemini(prompt, true);
            SummaryPayload payload = MAPPER.readValue(cleanJson(raw), SummaryPayload.class);

            if (payload.summary() == null || payload.summary().isBlank()) {
                throw new IllegalStateException("Gemini returned no summary");
            }

            return new ReportSummary(
                    payload.summary().trim(),
                    cleanPoints(payload.strengths()),
                    cleanPoints(payload.improvements())
            );

        } catch (Exception e) {
            log.warn("Gemini summary failed, using a simple summary. Reason: {}", e.getMessage());
            return fallbackSummary(items);
        }
    }

    // ---------------- helpers ----------------

    // Tries the main model first; if it fails (overloaded, slow, unavailable),
    // tries the backup model once before the callers fall back to the local logic
    private String callGemini(String prompt, boolean json) {
        try {
            return callModel(model, prompt, json);
        } catch (RuntimeException first) {
            if (fallbackModel == null || fallbackModel.isBlank() || fallbackModel.equals(model)) {
                throw first;
            }
            log.warn("Gemini model {} failed ({}). Retrying once with {}", model, first.getMessage(), fallbackModel);
            return callModel(fallbackModel, prompt, json);
        }
    }

    private String callModel(String modelName, String prompt, boolean json) {
        GeminiResponse response = geminiWebClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/models/{model}:generateContent")
                        .build(modelName))
                .header("x-goog-api-key", apiKey)   // header, so the key never appears in logged URLs
                .bodyValue(GeminiRequest.of(prompt, json))
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

    // Removes ```json ... ``` fences if the model added them anyway
    private static String cleanJson(String raw) {
        String s = raw.trim();
        if (s.startsWith("```")) {
            int firstNewline = s.indexOf('\n');
            int lastFence = s.lastIndexOf("```");
            if (firstNewline > 0 && lastFence > firstNewline) {
                s = s.substring(firstNewline + 1, lastFence).trim();
            }
        }
        return s;
    }

    private static List<String> cleanPoints(List<String> points) {
        if (points == null) {
            return List.of();
        }
        return points.stream()
                .filter(p -> p != null && !p.isBlank())
                .map(String::trim)
                .limit(5)
                .toList();
    }

    private static EvaluationResult estimateFromLength(String answerText) {
        int words = (answerText == null || answerText.isBlank()) ? 0 : answerText.trim().split("\\s+").length;
        double score = words == 0 ? 0 : Math.min(60, 15 + words * 1.5);
        return new EvaluationResult(score,
                "AI evaluation was unavailable, so this score is only an estimate based on answer length.");
    }

    private static ReportSummary fallbackSummary(List<QuestionFeedback> items) {
        double average = items.stream().mapToDouble(QuestionFeedback::score).average().orElse(0);

        List<String> strengths = new ArrayList<>();
        List<String> improvements = new ArrayList<>();

        for (QuestionFeedback item : items) {
            String shortQuestion = shorten(item.question(), 70);
            if (item.score() >= 70) {
                strengths.add("Good answer on: " + shortQuestion);
            } else {
                improvements.add("Revisit: " + shortQuestion);
            }
        }

        String summary = "You answered " + items.size() + " question" + (items.size() == 1 ? "" : "s")
                + " with an average score of " + Math.round(average) + " out of 100.";

        return new ReportSummary(summary, strengths, improvements);
    }

    private static String shorten(String text, int max) {
        if (text == null) {
            return "";
        }
        return text.length() <= max ? text : text.substring(0, max - 1).trim() + "…";
    }
}