package com.interviewforge.backend.controller;

import com.interviewforge.backend.dtos.user.PasswordChangeRequest;
import com.interviewforge.backend.dtos.user.UserResponse;
import com.interviewforge.backend.dtos.user.UserUpdateRequest;
import com.interviewforge.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe() {
        return ResponseEntity.ok(userService.getCurrent());
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateMe(@Valid @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(userService.updateProfile(request));
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody PasswordChangeRequest request) {
        userService.changePassword(request);
        return ResponseEntity.noContent().build();
    }
}