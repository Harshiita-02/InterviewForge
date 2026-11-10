package com.interviewforge.backend.controller;

import com.interviewforge.backend.exception.ResourceNotFoundException;
import com.interviewforge.backend.dtos.auth.LoginRequest;
import com.interviewforge.backend.dtos.auth.LoginResponse;
import com.interviewforge.backend.dtos.user.UserResponse;
import com.interviewforge.backend.dtos.user.UserSignupRequest;
import com.interviewforge.backend.entity.User;
import com.interviewforge.backend.repository.UserRepository;
import com.interviewforge.backend.security.UserPrincipal;
import com.interviewforge.backend.service.UserService;
import com.interviewforge.backend.service.impl.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<UserResponse> signup(@RequestBody UserSignupRequest request) {
        return ResponseEntity.ok(userService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String token = jwtService.generateToken(new UserPrincipal(user));

        return ResponseEntity.ok(new LoginResponse(token, user.getId(), user.getName()));
    }
}