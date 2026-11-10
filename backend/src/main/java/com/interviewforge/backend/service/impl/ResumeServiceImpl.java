package com.interviewforge.backend.service.impl;

import com.interviewforge.backend.exception.ResourceNotFoundException;
import com.interviewforge.backend.dtos.resume.ResumeResponse;
import com.interviewforge.backend.entity.Resume;
import com.interviewforge.backend.entity.User;
import com.interviewforge.backend.mapper.ResumeMapper;
import com.interviewforge.backend.repository.ResumeRepository;
import com.interviewforge.backend.repository.UserRepository;
import com.interviewforge.backend.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResumeServiceImpl implements ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final ResumeMapper resumeMapper;

    private static final String UPLOAD_DIR = "uploads/resumes/";

    @Override
    @Transactional
    public ResumeResponse upload(Long userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String storedPath = storeFile(file);

        Resume resume = Resume.builder()
                .user(user)
                .filePath(storedPath)
                .build();
        // parsedSkills stays null for now — Gemini-based parsing fills it in later

        Resume saved = resumeRepository.save(resume);
        return resumeMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResumeResponse> getByUserId(Long userId) {
        return resumeRepository.findByUserId(userId).stream()
                .map(resumeMapper::toResponse)
                .collect(Collectors.toList());
    }

    private String storeFile(MultipartFile file) {
        try {
            Files.createDirectories(Path.of(UPLOAD_DIR));
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path target = Path.of(UPLOAD_DIR, filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return target.toString();
        } catch (IOException e) {
            throw new IllegalStateException("Failed to store file", e);
        }
    }
}