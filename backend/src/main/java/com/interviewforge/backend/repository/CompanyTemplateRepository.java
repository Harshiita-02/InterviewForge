package com.interviewforge.backend.repository;

import com.interviewforge.backend.entity.CompanyTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CompanyTemplateRepository extends JpaRepository<CompanyTemplate, Long> {
    Optional<CompanyTemplate> findByCompanyName(String companyName);
}