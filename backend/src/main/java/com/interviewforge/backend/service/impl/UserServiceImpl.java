package com.interviewforge.backend.service.impl;

import com.interviewforge.backend.dtos.user.PasswordChangeRequest;
import com.interviewforge.backend.dtos.user.UserResponse;
import com.interviewforge.backend.dtos.user.UserSignupRequest;
import com.interviewforge.backend.dtos.user.UserUpdateRequest;
import com.interviewforge.backend.entity.User;
import com.interviewforge.backend.exception.BadRequestException;
import com.interviewforge.backend.exception.ConflictException;
import com.interviewforge.backend.exception.ResourceNotFoundException;
import com.interviewforge.backend.mapper.UserMapper;
import com.interviewforge.backend.repository.UserRepository;
import com.interviewforge.backend.security.CurrentUser;
import com.interviewforge.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final CurrentUser currentUser;

    @Override
    public UserResponse signup(UserSignupRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ConflictException("Email already registered");
        }

        User user = User.builder()
                .name(request.name().trim())
                .email(request.email().trim())
                .passwordHash(passwordEncoder.encode(request.password()))
                .build();

        User saved = userRepository.save(user);
        return userMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrent() {
        return userMapper.toResponse(loadCurrentUser());
    }

    @Override
    @Transactional
    public UserResponse updateProfile(UserUpdateRequest request) {
        User user = loadCurrentUser();
        user.setName(request.name().trim());
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void changePassword(PasswordChangeRequest request) {
        User user = loadCurrentUser();

        // 400, not 401: a wrong current password must not log the user out in the frontend
        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    private User loadCurrentUser() {
        return userRepository.findById(currentUser.id())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}