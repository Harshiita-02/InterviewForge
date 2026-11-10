package com.interviewforge.backend.dtos.resume;

public record ResumeUploadRequest(
        Long userId
        // the actual file itself arrives as multipart form data, not JSON —
        // see the controller below
){}