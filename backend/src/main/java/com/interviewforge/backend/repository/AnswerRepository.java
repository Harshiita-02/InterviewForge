package com.interviewforge.backend.repository;

import com.interviewforge.backend.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
    Optional<Answer> findByQuestionId(Long questionId);

    // One row per session: [sessionId, average answer score], for one user's sessions
    @Query("select a.question.session.id, avg(a.score) from Answer a " +
            "where a.question.session.user.id = :userId " +
            "group by a.question.session.id")
    List<Object[]> averageScoresBySessionForUser(@Param("userId") Long userId);

    // One row per finished session of ANY user since a date:
    // [userId, sessionId, endedAt, average answer score]
    @Query("select a.question.session.user.id, a.question.session.id, a.question.session.endedAt, avg(a.score) " +
            "from Answer a " +
            "where a.question.session.status = com.interviewforge.backend.entity.enums.SessionStatus.COMPLETED " +
            "and a.question.session.endedAt >= :since " +
            "group by a.question.session.user.id, a.question.session.id, a.question.session.endedAt")
    List<Object[]> completedSessionAveragesSince(@Param("since") LocalDateTime since);
}