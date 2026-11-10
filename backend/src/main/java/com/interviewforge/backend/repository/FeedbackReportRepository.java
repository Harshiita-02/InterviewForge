package com.interviewforge.backend.repository;

import com.interviewforge.backend.entity.FeedbackReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FeedbackReportRepository extends JpaRepository<FeedbackReport, Long> {
    Optional<FeedbackReport> findBySessionId(Long sessionId);
}
