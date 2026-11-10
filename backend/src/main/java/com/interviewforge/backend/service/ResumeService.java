package com.interviewforge.backend.service;

import com.interviewforge.backend.dtos.resume.ResumeResponse;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface ResumeService {
    ResumeResponse upload(Long userId, MultipartFile file);
    List<ResumeResponse> getByUserId(Long userId);
}