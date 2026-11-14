package com.interviewforge.backend.service;

import com.interviewforge.backend.dtos.user.PasswordChangeRequest;
import com.interviewforge.backend.dtos.user.UserResponse;
import com.interviewforge.backend.dtos.user.UserSignupRequest;
import com.interviewforge.backend.dtos.user.UserUpdateRequest;

public interface UserService {
    UserResponse signup(UserSignupRequest request);
    UserResponse getCurrent();
    UserResponse updateProfile(UserUpdateRequest request);
    void changePassword(PasswordChangeRequest request);
}