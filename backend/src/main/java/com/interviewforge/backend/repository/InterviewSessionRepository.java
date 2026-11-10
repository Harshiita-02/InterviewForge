package com.interviewforge.backend.repository;

import com.interviewforge.backend.entity.InterviewSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InterviewSessionRepository extends JpaRepository<InterviewSession, Long> {
    List<InterviewSession> findByUserId(Long userId);
    List<InterviewSession> findByUserIdOrderByStartedAtDesc(Long userId);
}