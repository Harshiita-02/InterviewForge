package com.interviewforge.backend.dtos.user;

public record UserSignupRequest(
        String name,
        String email,
        String password   // plaintext in transit only — hashed before hitting the entity
) {}