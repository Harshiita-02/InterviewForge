package com.interviewforge.backend.service.gemini;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GeminiResponse(List<Candidate> candidates) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Candidate(Content content) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Content(List<Part> parts) {}

    public record Part(String text) {}

    public String extractText() {
        if (candidates == null || candidates.isEmpty()) {
            return null;
        }
        return candidates.get(0).content().parts().get(0).text();
    }
}