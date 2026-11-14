package com.interviewforge.backend.service.impl;

import com.interviewforge.backend.dtos.progress.ProgressResponse;
import com.interviewforge.backend.entity.InterviewSession;
import com.interviewforge.backend.entity.Topic;
import com.interviewforge.backend.entity.enums.DifficultyLevel;
import com.interviewforge.backend.entity.enums.InterviewType;
import com.interviewforge.backend.entity.enums.SessionStatus;
import com.interviewforge.backend.repository.AnswerRepository;
import com.interviewforge.backend.repository.InterviewSessionRepository;
import com.interviewforge.backend.security.CurrentUser;
import com.interviewforge.backend.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProgressServiceImpl implements ProgressService {

    private final InterviewSessionRepository sessionRepository;
    private final AnswerRepository answerRepository;
    private final CurrentUser currentUser;

    @Override
    @Transactional(readOnly = true)
    public ProgressResponse getProgress() {
        Long userId = currentUser.id();

        // sessionId -> average answer score of that session
        Map<Long, Double> averageBySession = new HashMap<>();
        for (Object[] row : answerRepository.averageScoresBySessionForUser(userId)) {
            Long sessionId = (Long) row[0];
            double average = row[1] == null ? 0 : ((Number) row[1]).doubleValue();
            averageBySession.put(sessionId, average);
        }

        // Finished sessions that have at least one answer, oldest first
        List<InterviewSession> sessions = sessionRepository.findByUserIdOrderByStartedAtDesc(userId).stream()
                .filter(s -> s.getStatus() == SessionStatus.COMPLETED && averageBySession.containsKey(s.getId()))
                .sorted(Comparator.comparing(ProgressServiceImpl::finishedAt))
                .toList();

        List<ProgressResponse.ScorePoint> scores = sessions.stream()
                .map(s -> new ProgressResponse.ScorePoint(
                        s.getId(), finishedAt(s), score(averageBySession, s)))
                .toList();

        List<ProgressResponse.HistoryItem> history = new ArrayList<>(sessions.stream()
                .map(s -> new ProgressResponse.HistoryItem(
                        s.getId(),
                        s.getRole() + ", " + typeLabel(s.getInterviewType()),
                        typeLabel(s.getInterviewType()),
                        difficultyLabel(s.getDifficulty()),
                        finishedAt(s),
                        score(averageBySession, s)))
                .toList());
        Collections.reverse(history);   // newest first

        return new ProgressResponse(scores, topicScores(sessions, averageBySession), history);
    }

    // Average of the session scores of every interview that included the topic
    private List<ProgressResponse.TopicScore> topicScores(
            List<InterviewSession> sessions, Map<Long, Double> averageBySession) {

        Map<String, List<Double>> scoresByTopic = new HashMap<>();
        for (InterviewSession session : sessions) {
            double average = averageBySession.get(session.getId());
            for (Topic topic : session.getTopics()) {
                scoresByTopic.computeIfAbsent(topic.getName(), k -> new ArrayList<>()).add(average);
            }
        }

        return scoresByTopic.entrySet().stream()
                .map(e -> new ProgressResponse.TopicScore(
                        e.getKey(),
                        (int) Math.round(e.getValue().stream().mapToDouble(Double::doubleValue).average().orElse(0))))
                .sorted(Comparator.comparingInt(ProgressResponse.TopicScore::score).reversed())
                .limit(5)
                .toList();
    }

    private static int score(Map<Long, Double> averageBySession, InterviewSession session) {
        return (int) Math.round(averageBySession.getOrDefault(session.getId(), 0.0));
    }

    private static LocalDateTime finishedAt(InterviewSession session) {
        return session.getEndedAt() != null ? session.getEndedAt() : session.getStartedAt();
    }

    private static String typeLabel(InterviewType type) {
        return switch (type) {
            case TECHNICAL -> "Technical";
            case HR -> "HR";
            case MIXED -> "Mixed";
        };
    }

    private static String difficultyLabel(DifficultyLevel level) {
        return switch (level) {
            case EASY -> "Easy";
            case MEDIUM -> "Medium";
            case HARD -> "Hard";
        };
    }
}