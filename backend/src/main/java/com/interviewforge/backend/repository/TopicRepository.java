package com.interviewforge.backend.repository;

import com.interviewforge.backend.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TopicRepository extends JpaRepository<Topic, Long> {
    Optional<Topic> findByName(String name);
    boolean existsByName(String name);
}