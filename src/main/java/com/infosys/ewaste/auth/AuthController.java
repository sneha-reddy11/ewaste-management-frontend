package com.infosys.ewaste.auth;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ===============================
    // REGISTER
    // ===============================
    @PostMapping("/register")
    public String register(@RequestBody User user) {
        return authService.register(user);
    }

    // ===============================
    // VERIFY OTP (REGISTER)
    // ===============================
    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestBody OtpRequest request) {
        return authService.verifyOtp(request);
    }

    // ===============================
    // LOGIN
    // ===============================
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    // ===============================
    // FORGOT PASSWORD - SEND OTP
    // ===============================
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody ForgotPasswordRequest request) {
        return authService.sendForgotPasswordOtp(request.getEmail());
    }

    // ===============================
    // RESET PASSWORD USING OTP
    // ===============================
    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody ForgotPasswordRequest request) {
        return authService.resetPassword(request);
    }
}
