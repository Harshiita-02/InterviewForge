package com.interviewforge.backend.service.gemini;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GeminiRequest(List<Content> contents) {

    public record Content(List<Part> parts) {}
    public record Part(String text) {}

    public static GeminiRequest of(String prompt) {
        return new GeminiRequest(List.of(new Content(List.of(new Part(prompt)))));
    }
}