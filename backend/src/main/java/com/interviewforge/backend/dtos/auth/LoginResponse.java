package com.interviewforge.backend.dtos.auth;

public record LoginResponse(String token, Long userId, String name) {}