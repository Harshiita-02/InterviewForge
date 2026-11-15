package com.interviewforge.backend.service.impl;

import com.interviewforge.backend.dtos.leaderboard.LeaderboardResponse;
import com.interviewforge.backend.entity.User;
import com.interviewforge.backend.repository.AnswerRepository;
import com.interviewforge.backend.repository.UserRepository;
import com.interviewforge.backend.security.CurrentUser;
import com.interviewforge.backend.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaderboardServiceImpl implements LeaderboardService {

    private final AnswerRepository answerRepository;
    private final UserRepository userRepository;
    private final CurrentUser currentUser;

    private static final int TOP_COUNT = 10;

    // One student's standing: average of their session scores, and how many sessions
    private record Ranked(Long userId, double average, int interviews) {}

    @Override
    @Transactional(readOnly = true)
    public LeaderboardResponse getLeaderboard(String period) {
        String key = period == null ? "all" : period.toLowerCase();
        String periodName = key.equals("week") || key.equals("month") ? key : "all";

        LocalDateTime since = switch (periodName) {
            case "week" -> LocalDateTime.now().minusDays(7);
            case "month" -> LocalDateTime.now().minusDays(30);
            default -> LocalDateTime.of(2000, 1, 1, 0, 0);
        };

        // userId -> scores of that student's finished sessions in the period
        Map<Long, List<Double>> sessionScoresByUser = new HashMap<>();
        for (Object[] row : answerRepository.completedSessionAveragesSince(since)) {
            Long userId = (Long) row[0];
            double average = row[3] == null ? 0 : ((Number) row[3]).doubleValue();
            sessionScoresByUser.computeIfAbsent(userId, k -> new ArrayList<>()).add(average);
        }

        // Best average first; ties go to the student with more interviews, then the lower id
        List<Ranked> ranked = sessionScoresByUser.entrySet().stream()
                .map(e -> new Ranked(
                        e.getKey(),
                        e.getValue().stream().mapToDouble(Double::doubleValue).average().orElse(0),
                        e.getValue().size()))
                .sorted(Comparator.comparingDouble(Ranked::average).reversed()
                        .thenComparing(Comparator.comparingInt(Ranked::interviews).reversed())
                        .thenComparingLong(Ranked::userId))
                .toList();

        Map<Long, String> names = userRepository.findAllById(sessionScoresByUser.keySet()).stream()
                .collect(Collectors.toMap(User::getId, User::getName));

        Long yourId = currentUser.id();
        int yourIndex = -1;
        for (int i = 0; i < ranked.size(); i++) {
            if (ranked.get(i).userId().equals(yourId)) {
                yourIndex = i;
                break;
            }
        }

        LeaderboardResponse.Entry yourEntry;
        if (yourIndex >= 0) {
            yourEntry = toEntry(ranked.get(yourIndex), names);
        } else {
            // No finished interview in this period: shown unranked, with zeros
            String yourName = userRepository.findById(yourId).map(User::getName).orElse("You");
            yourEntry = new LeaderboardResponse.Entry(yourId, displayName(yourName), 0, 0);
        }

        int yourRank = yourIndex >= 0 ? yourIndex + 1 : ranked.size() + 1;
        int totalStudents = yourIndex >= 0 ? ranked.size() : ranked.size() + 1;

        // The student just above you (or the last ranked student, if you are unranked)
        Ranked target = null;
        if (yourIndex > 0) {
            target = ranked.get(yourIndex - 1);
        } else if (yourIndex < 0 && !ranked.isEmpty()) {
            target = ranked.get(ranked.size() - 1);
        }
        Integer pointsToNextRank = null;
        if (target != null) {
            pointsToNextRank = Math.max(1, (int) Math.round(target.average()) - yourEntry.averageScore());
        }

        List<LeaderboardResponse.Entry> top = ranked.stream()
                .limit(TOP_COUNT)
                .map(r -> toEntry(r, names))
                .toList();

        return new LeaderboardResponse(periodName, totalStudents, yourRank, yourEntry, pointsToNextRank, top);
    }

    private LeaderboardResponse.Entry toEntry(Ranked ranked, Map<Long, String> names) {
        return new LeaderboardResponse.Entry(
                ranked.userId(),
                displayName(names.getOrDefault(ranked.userId(), "Student")),
                ranked.interviews(),
                (int) Math.round(ranked.average()));
    }

    // "Aarav Sharma" -> "Aarav S."
    private static String displayName(String fullName) {
        String[] parts = fullName.trim().split("\\s+");
        if (parts.length == 1) {
            return parts[0];
        }
        String last = parts[parts.length - 1];
        return parts[0] + " " + Character.toUpperCase(last.charAt(0)) + ".";
    }
}