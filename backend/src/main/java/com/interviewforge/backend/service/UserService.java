package com.interviewforge.backend.service;

import com.interviewforge.backend.dtos.user.UserResponse;
import com.interviewforge.backend.dtos.user.UserSignupRequest;

public interface UserService {
    UserResponse signup(UserSignupRequest request);
    UserResponse getById(Long id);
}