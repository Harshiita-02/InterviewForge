package com.interviewforge.backend.service.impl;

import com.interviewforge.backend.dtos.dashboard.DashboardResponse;
import com.interviewforge.backend.entity.InterviewSession;
import com.interviewforge.backend.entity.Topic;
import com.interviewforge.backend.entity.enums.InterviewType;
import com.interviewforge.backend.entity.enums.SessionStatus;
import com.interviewforge.backend.repository.AnswerRepository;
import com.interviewforge.backend.repository.InterviewSessionRepository;
import com.interviewforge.backend.security.CurrentUser;
import com.interviewforge.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final InterviewSessionRepository sessionRepository;
    private final AnswerRepository answerRepository;
    private final CurrentUser currentUser;

    @Override
    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {
        Long userId = currentUser.id();

        List<InterviewSession> sessions = sessionRepository.findByUserIdOrderByStartedAtDesc(userId);

        // sessionId -> average answer score of that session
        Map<Long, Double> averageBySession = new HashMap<>();
        for (Object[] row : answerRepository.averageScoresBySessionForUser(userId)) {
            Long sessionId = (Long) row[0];
            double average = row[1] == null ? 0 : ((Number) row[1]).doubleValue();
            averageBySession.put(sessionId, average);
        }

        List<InterviewSession> completed = sessions.stream()
                .filter(s -> s.getStatus() == SessionStatus.COMPLETED)
                .toList();

        // Scores of completed sessions that have at least one answer
        List<Double> scores = completed.stream()
                .filter(s -> averageBySession.containsKey(s.getId()))
                .map(s -> averageBySession.get(s.getId()))
                .toList();

        int averageScore = scores.isEmpty()
                ? 0
                : (int) Math.round(scores.stream().mapToDouble(Double::doubleValue).average().orElse(0));
        int bestScore = scores.isEmpty()
                ? 0
                : (int) Math.round(scores.stream().mapToDouble(Double::doubleValue).max().orElse(0));

        DashboardResponse.Stats stats = new DashboardResponse.Stats(
                sessions.size(), completed.size(), averageScore, bestScore);

        // The 3 most recently finished sessions
        List<DashboardResponse.RecentSession> recent = completed.stream()
                .sorted(Comparator.comparing(
                        InterviewSession::getEndedAt,
                        Comparator.nullsLast(Comparator.<LocalDateTime>reverseOrder())))
                .limit(3)
                .map(s -> new DashboardResponse.RecentSession(
                        s.getId(),
                        s.getRole() + ", " + typeLabel(s.getInterviewType()),
                        s.getEndedAt() != null ? s.getEndedAt() : s.getStartedAt(),
                        (int) Math.round(averageBySession.getOrDefault(s.getId(), 0.0))))
                .toList();

        return new DashboardResponse(stats, buildSuggestion(completed, averageBySession), recent);
    }

    // Suggest the topic with the lowest average score across completed sessions
    private DashboardResponse.Suggestion buildSuggestion(
            List<InterviewSession> completed, Map<Long, Double> averageBySession) {

        Map<String, List<Double>> scoresByTopic = new HashMap<>();
        for (InterviewSession session : completed) {
            Double average = averageBySession.get(session.getId());
            if (average == null) {
                continue;
            }
            for (Topic topic : session.getTopics()) {
                scoresByTopic.computeIfAbsent(topic.getName(), k -> new ArrayList<>()).add(average);
            }
        }

        String lowestTopic = null;
        double lowestAverage = Double.MAX_VALUE;
        for (Map.Entry<String, List<Double>> entry : scoresByTopic.entrySet()) {
            double mean = entry.getValue().stream().mapToDouble(Double::doubleValue).average().orElse(0);
            if (mean < lowestAverage) {
                lowestAverage = mean;
                lowestTopic = entry.getKey();
            }
        }

        if (lowestTopic == null) {
            return null;
        }

        String difficulty = lowestAverage < 50 ? "Easy" : lowestAverage < 75 ? "Medium" : "Hard";
        return new DashboardResponse.Suggestion(
                lowestTopic, difficulty, "Your lowest topic at " + Math.round(lowestAverage) + "%");
    }

    private static String typeLabel(InterviewType type) {
        return switch (type) {
            case TECHNICAL -> "Technical";
            case HR -> "HR";
            case MIXED -> "Mixed";
        };
    }
}