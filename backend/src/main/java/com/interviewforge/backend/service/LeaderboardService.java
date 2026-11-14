package com.interviewforge.backend.service;

import com.interviewforge.backend.dtos.leaderboard.LeaderboardResponse;

public interface LeaderboardService {
    LeaderboardResponse getLeaderboard(String period);
}