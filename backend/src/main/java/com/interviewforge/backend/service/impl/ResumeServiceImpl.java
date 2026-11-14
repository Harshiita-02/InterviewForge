package com.interviewforge.backend.service.impl;

import com.interviewforge.backend.dtos.resume.ResumeResponse;
import com.interviewforge.backend.entity.Resume;
import com.interviewforge.backend.entity.User;
import com.interviewforge.backend.exception.BadRequestException;
import com.interviewforge.backend.exception.ResourceNotFoundException;
import com.interviewforge.backend.mapper.ResumeMapper;
import com.interviewforge.backend.repository.InterviewSessionRepository;
import com.interviewforge.backend.repository.ResumeRepository;
import com.interviewforge.backend.repository.UserRepository;
import com.interviewforge.backend.security.CurrentUser;
import com.interviewforge.backend.service.ResumeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ResumeServiceImpl implements ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final InterviewSessionRepository sessionRepository;
    private final ResumeMapper resumeMapper;
    private final CurrentUser currentUser;

    private static final String UPLOAD_DIR = "uploads/resumes/";
    private static final long MAX_SIZE_BYTES = 5L * 1024 * 1024;
    private static final int MAX_TEXT_CHARS = 6000;

    @Override
    @Transactional
    public ResumeResponse upload(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Choose a PDF file to upload");
        }
        if (!"application/pdf".equalsIgnoreCase(file.getContentType())) {
            throw new BadRequestException("Only PDF files are supported");
        }
        if (file.getSize() > MAX_SIZE_BYTES) {
            throw new BadRequestException("File is larger than 5 MB");
        }

        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (IOException e) {
            throw new IllegalStateException("Failed to read the uploaded file", e);
        }

        // A real PDF starts with "%PDF"; the content type alone can be faked
        if (bytes.length < 4 || bytes[0] != '%' || bytes[1] != 'P' || bytes[2] != 'D' || bytes[3] != 'F') {
            throw new BadRequestException("That file doesn't look like a valid PDF");
        }

        User user = userRepository.findById(currentUser.id())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String original = file.getOriginalFilename() == null ? "resume.pdf" : file.getOriginalFilename();
        String displayName = Path.of(original).getFileName().toString();
        if (displayName.length() > 255) {
            displayName = displayName.substring(0, 255);
        }

        Resume resume = Resume.builder()
                .user(user)
                .filePath(storeFile(user.getId(), displayName, bytes))
                .fileName(displayName)
                .fileSize((long) bytes.length)
                .parsedSkills(extractText(bytes))
                .build();

        return resumeMapper.toResponse(resumeRepository.save(resume), 0);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResumeResponse> getMine() {
        return resumeRepository.findByUserId(currentUser.id()).stream()
                .sorted((a, b) -> b.getUploadedAt().compareTo(a.getUploadedAt()))
                .map(r -> resumeMapper.toResponse(r, (int) sessionRepository.countByResumeId(r.getId())))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));

        // Same 404 for "not yours" and "does not exist"
        if (!resume.getUser().getId().equals(currentUser.id())) {
            throw new ResourceNotFoundException("Resume not found");
        }

        String filePath = resume.getFilePath();

        sessionRepository.clearResume(id);   // past interviews keep working without the resume
        resumeRepository.deleteById(id);

        try {
            Files.deleteIfExists(Path.of(filePath));
        } catch (IOException e) {
            log.warn("Could not delete resume file {}: {}", filePath, e.getMessage());
        }
    }

    private String storeFile(Long userId, String displayName, byte[] bytes) {
        try {
            Files.createDirectories(Path.of(UPLOAD_DIR));

            // Strip unusual characters so the stored name can never escape the upload folder
            String safeName = displayName.replaceAll("[^A-Za-z0-9._-]", "_");
            Path target = Path.of(UPLOAD_DIR, userId + "_" + System.currentTimeMillis() + "_" + safeName);
            Files.write(target, bytes);
            return target.toString();
        } catch (IOException e) {
            throw new IllegalStateException("Failed to store file", e);
        }
    }

    // Reads the text out of the PDF; returns null for scanned or unreadable files
    private String extractText(byte[] bytes) {
        try (PDDocument document = Loader.loadPDF(bytes)) {
            String text = new PDFTextStripper().getText(document).replaceAll("\\s+", " ").trim();
            if (text.isEmpty()) {
                return null;
            }
            return text.length() > MAX_TEXT_CHARS ? text.substring(0, MAX_TEXT_CHARS) : text;
        } catch (Exception e) {
            log.warn("Could not read text from the resume PDF: {}", e.getMessage());
            return null;
        }
    }
}