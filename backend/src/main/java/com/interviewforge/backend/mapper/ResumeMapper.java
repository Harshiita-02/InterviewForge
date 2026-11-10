package com.interviewforge.backend.mapper;

import com.interviewforge.backend.dtos.resume.ResumeResponse;
import com.interviewforge.backend.entity.Resume;
import org.springframework.stereotype.Component;

@Component
public class ResumeMapper {

    public ResumeResponse toResponse(Resume resume) {
        return new ResumeResponse(
                resume.getId(),
                resume.getUser().getId(),
                resume.getFilePath(),
                resume.getParsedSkills(),
                resume.getUploadedAt()
        );
    }
}