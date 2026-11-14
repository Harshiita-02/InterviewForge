package com.interviewforge.backend.mapper;

import com.interviewforge.backend.dtos.resume.ResumeResponse;
import com.interviewforge.backend.entity.Resume;
import org.springframework.stereotype.Component;

@Component
public class ResumeMapper {

    public ResumeResponse toResponse(Resume resume, int interviewsUsed) {
        String fileName = resume.getFileName() != null
                ? resume.getFileName()
                : nameFromPath(resume.getFilePath());

        long bytes = resume.getFileSize() != null ? resume.getFileSize() : 0;
        int sizeKb = bytes == 0 ? 0 : (int) Math.max(1, Math.round(bytes / 1024.0));

        return new ResumeResponse(resume.getId(), fileName, resume.getUploadedAt(), sizeKb, interviewsUsed);
    }

    // For old rows saved before file names were stored: "uploads/resumes/1_173_My.pdf" -> "My.pdf"
    private String nameFromPath(String filePath) {
        String file = filePath.substring(Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\')) + 1);
        return file.replaceFirst("^\\d+_\\d+_", "");
    }
}