package com.infosys.ewaste.auth;

import java.time.LocalDateTime;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.infosys.ewaste.security.JwtUtil;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       EmailService emailService,
                       BCryptPasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // ===============================
    // REGISTER
    // ===============================
    public String register(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "Email already registered";
        }

        String passwordError = validatePassword(user.getPassword());
        if (passwordError != null) {
            return passwordError;
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEnabled(false);

        String otp = generateOtp();
        user.setOtp(otp);
        user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(10));

        userRepository.save(user);
        emailService.sendOtpMail(user.getEmail(), otp);

        return "OTP sent to your email. Please verify within 10 minutes.";
    }

    // ===============================
    // VERIFY OTP (REGISTER)
    // ===============================
    public String verifyOtp(OtpRequest request) {

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null) return "User not found";

        if (user.getOtpExpiryTime().isBefore(LocalDateTime.now())) {
            return "OTP expired. Please request a new OTP.";
        }

        if (user.getOtp().equals(request.getOtp())) {
            user.setEnabled(true);
            user.setOtp(null);
            user.setOtpExpiryTime(null);
            userRepository.save(user);
            return "Email verified successfully";
        }

        return "Invalid OTP";
    }

    // ===============================
    // LOGIN
    // ===============================
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null) {
            return new LoginResponse(null, "Please register first");
        }

        if (!user.isEnabled()) {
            return new LoginResponse(null, "Please verify your email before login");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new LoginResponse(null, "Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return new LoginResponse(token, "Login successful");
    }

    // ===============================
    // FORGOT PASSWORD - SEND OTP
    // ===============================
    public String sendForgotPasswordOtp(String email) {

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return "No account found with this email";
        }

        String otp = generateOtp();
        user.setOtp(otp);
        user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(10));

        userRepository.save(user);

        emailService.sendOtpMail(user.getEmail(), otp);

        return "OTP sent to your email for password reset";
    }

    // ===============================
    // RESET PASSWORD USING OTP
    // ===============================
    public String resetPassword(ForgotPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null) {
            return "User not found";
        }

        if (user.getOtp() == null ||
            user.getOtpExpiryTime().isBefore(LocalDateTime.now())) {
            return "OTP expired. Please request again.";
        }

        if (!user.getOtp().equals(request.getOtp())) {
            return "Invalid OTP";
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return "New password and confirm password do not match";
        }

        String passwordError = validatePassword(request.getNewPassword());
        if (passwordError != null) {
            return passwordError;
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setOtp(null);
        user.setOtpExpiryTime(null);

        userRepository.save(user);

        return "Password reset successfully";
    }

    // ===============================
    // STRONG PASSWORD VALIDATION
    // ===============================
    private String validatePassword(String password) {

        StringBuilder errorMessage = new StringBuilder("Password must contain:\n");

        if (password.length() < 8) {
            errorMessage.append("- At least 8 characters\n");
        }

        if (!password.matches(".*[A-Z].*")) {
            errorMessage.append("- One uppercase letter\n");
        }

        if (!password.matches(".*[a-z].*")) {
            errorMessage.append("- One lowercase letter\n");
        }

        if (!password.matches(".*[0-9].*")) {
            errorMessage.append("- One number\n");
        }

        if (!password.matches(".*[@#$%^&+=!].*")) {
            errorMessage.append("- One special character\n");
        }

        if (errorMessage.toString().equals("Password must contain:\n")) {
            return null;
        }

        return errorMessage.toString();
    }

    // ===============================
    // OTP GENERATOR
    // ===============================
    private String generateOtp() {
        int otp = (int) (Math.random() * 900000) + 100000;
        return String.valueOf(otp);
    }
}
