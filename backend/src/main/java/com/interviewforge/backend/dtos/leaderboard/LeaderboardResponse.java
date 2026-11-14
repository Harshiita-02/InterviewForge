package com.interviewforge.backend.dtos.leaderboard;

import java.util.List;

public record LeaderboardResponse(
        String period,                // "week" | "month" | "all"
        int totalStudents,
        int yourRank,
        Entry yourEntry,
        Integer pointsToNextRank,     // null when you are already #1
        List<Entry> top               // the top 10
) {

    public record Entry(
            Long userId,
            String name,              // shown as "Aarav S." for privacy
            int interviews,
            int averageScore
    ) {}
}