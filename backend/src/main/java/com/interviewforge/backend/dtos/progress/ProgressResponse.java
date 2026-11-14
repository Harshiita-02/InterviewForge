package com.interviewforge.backend.dtos.progress;

import java.time.LocalDateTime;
import java.util.List;

public record ProgressResponse(
        List<ScorePoint> scores,      // oldest first, for the trend chart
        List<TopicScore> topics,      // best first, at most 5
        List<HistoryItem> history     // newest first
) {

    public record ScorePoint(Long sessionId, LocalDateTime completedAt, int score) {}

    public record TopicScore(String topic, int score) {}

    public record HistoryItem(
            Long id,
            String title,
            String type,            // "Technical" | "HR" | "Mixed"
            String difficulty,      // "Easy" | "Medium" | "Hard"
            LocalDateTime completedAt,
            int score
    ) {}
}