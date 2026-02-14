package com.ewaste.controller;

import com.ewaste.dto.AuthResponse;
import com.ewaste.dto.EmailRequest;
import com.ewaste.dto.LoginRequest;
import com.ewaste.dto.OtpVerifyRequest;
import com.ewaste.dto.RegisterRequest;
import com.ewaste.dto.ChangePasswordRequest;
import com.ewaste.dto.ResetPasswordRequest;
import com.ewaste.service.UserService;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    /* ================================
       REGISTER
    ================================ */

    @PostMapping("/register")
    public Map<String, String> registerUser(
            @RequestBody RegisterRequest request) {

        String message = service.registerUser(request);
        return Map.of("message", message);
    }

    /* ================================
       VERIFY OTP (REGISTRATION)
    ================================ */

    @PostMapping("/verify-otp")
    public AuthResponse verifyOtp(
            @RequestBody OtpVerifyRequest request) {

        String token = service.verifyOtp(
                request.getEmail(),
                request.getOtp()
        );

        return new AuthResponse(
                "Registration successful",
                token
        );
    }

    /* ================================
       LOGIN OTP REQUEST
    ================================ */

    @PostMapping("/login/request-otp")
    public Map<String, String> requestLoginOtp(
            @RequestBody EmailRequest request) {

        String message = service.requestLoginOtp(
                request.getEmail()
        );

        return Map.of("message", message);
    }

    /* ================================
       LOGIN OTP VERIFY
    ================================ */

    @PostMapping("/login/verify-otp")
    public AuthResponse verifyLoginOtp(
            @RequestBody OtpVerifyRequest request) {

        String token = service.verifyLoginOtp(
                request.getEmail(),
                request.getOtp()
        );

        return new AuthResponse(
                "Login successful",
                token
        );
    }

    /* ================================
       LOGIN WITH PASSWORD
    ================================ */

    @PostMapping("/login")
    public AuthResponse loginWithPassword(
            @RequestBody LoginRequest request) {

        String token = service.loginWithPassword(
                request.getEmail(),
                request.getPassword()
        );

        return new AuthResponse(
                "Login successful",
                token
        );
    }

    /* ================================
       CHANGE PASSWORD (PROFILE)
    ================================ */

    @PostMapping("/change-password")
    public Map<String, String> changePassword(
            @RequestBody ChangePasswordRequest request,
            @RequestHeader("Authorization") String token) {

        String message = service.changePassword(
                request,
                token
        );

        return Map.of("message", message);
    }

    /* ================================
       FORGOT PASSWORD (SEND OTP)
    ================================ */

    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(
            @RequestBody EmailRequest request) {

        String message = service.forgotPassword(
                request.getEmail()
        );

        return Map.of("message", message);
    }

    /* ================================
       RESET PASSWORD
    ================================ */

    @PostMapping("/reset-password")
    public Map<String, String> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        String message = service.resetPassword(request);

        return Map.of("message", message);
    }
}
