package com.interviewforge.backend.dtos.auth;

import com.interviewforge.backend.dtos.user.UserResponse;

public record LoginResponse(String token, UserResponse user) {}