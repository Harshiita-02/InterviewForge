package com.interviewforge.backend.dtos.dashboard;

import java.time.LocalDateTime;
import java.util.List;

public record DashboardResponse(
        Stats stats,
        Suggestion suggestion,            // null until there is enough history
        List<RecentSession> recentSessions
) {

    public record Stats(
            int totalInterviews,
            int completedInterviews,
            int averageScore,
            int bestScore
    ) {}

    public record Suggestion(
            String topic,
            String difficulty,            // "Easy" | "Medium" | "Hard"
            String reason
    ) {}

    public record RecentSession(
            Long id,
            String title,
            LocalDateTime completedAt,
            int score
    ) {}
}