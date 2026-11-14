package com.interviewforge.backend.service.gemini;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public record GeminiRequest(List<Content> contents, GenerationConfig generationConfig) {

    public record Content(List<Part> parts) {}
    public record Part(String text) {}
    public record GenerationConfig(String responseMimeType) {}

    public static GeminiRequest of(String prompt) {
        return of(prompt, false);
    }

    // json = true asks Gemini to answer with pure JSON (no ```json fences)
    public static GeminiRequest of(String prompt, boolean json) {
        return new GeminiRequest(
                List.of(new Content(List.of(new Part(prompt)))),
                json ? new GenerationConfig("application/json") : null
        );
    }
}