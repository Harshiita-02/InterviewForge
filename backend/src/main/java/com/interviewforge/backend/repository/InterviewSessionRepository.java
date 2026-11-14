package com.interviewforge.backend.repository;

import com.interviewforge.backend.entity.InterviewSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InterviewSessionRepository extends JpaRepository<InterviewSession, Long> {
    List<InterviewSession> findByUserId(Long userId);
    List<InterviewSession> findByUserIdOrderByStartedAtDesc(Long userId);

    long countByResumeId(Long resumeId);

    // Detach a resume from its sessions before the resume is deleted
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update InterviewSession s set s.resume = null where s.resume.id = :resumeId")
    void clearResume(@Param("resumeId") Long resumeId);
}