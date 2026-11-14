package com.interviewforge.backend.config;

import com.interviewforge.backend.entity.CompanyTemplate;
import com.interviewforge.backend.entity.Topic;
import com.interviewforge.backend.repository.CompanyTemplateRepository;
import com.interviewforge.backend.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

// Runs once at startup and only adds what is missing, so restarts are safe.
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final TopicRepository topicRepository;
    private final CompanyTemplateRepository templateRepository;

    @Override
    @Transactional
    public void run(String... args) {
        List<String> topicNames = List.of(
                "Java", "Spring Boot", "DBMS", "SQL", "DSA", "OOP", "React", "System Design");

        Map<String, Topic> topics = new HashMap<>();
        for (String name : topicNames) {
            Topic topic = topicRepository.findByName(name)
                    .orElseGet(() -> topicRepository.save(
                            Topic.builder().name(name).isPredefined(true).build()));
            topics.put(name, topic);
        }

        seedTemplate("TCS", "Typical TCS campus drive focus.", List.of("Java", "DBMS", "OOP"), topics);
        seedTemplate("Infosys", "Typical Infosys campus drive focus.", List.of("Java", "SQL", "DSA"), topics);
        seedTemplate("Accenture", "Typical Accenture campus drive focus.", List.of("Java", "SQL", "OOP"), topics);
    }

    private void seedTemplate(String company, String description, List<String> topicNames, Map<String, Topic> topics) {
        if (templateRepository.findByCompanyName(company).isPresent()) {
            return;
        }

        Set<Topic> templateTopics = new HashSet<>();
        for (String name : topicNames) {
            templateTopics.add(topics.get(name));
        }

        templateRepository.save(CompanyTemplate.builder()
                .companyName(company)
                .description(description)
                .topics(templateTopics)
                .build());
    }
}