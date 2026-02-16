package com.infosys.ewaste.profile;

import com.infosys.ewaste.auth.User;
import com.infosys.ewaste.auth.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public ProfileController(UserRepository userRepository,
                             BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ===============================
    // VIEW PROFILE
    // ===============================
    @GetMapping
    public User viewProfile(Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ===============================
    // UPDATE PROFILE
    // ===============================
    @PutMapping
    public String updateProfile(@RequestBody User updatedUser,
                                Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(updatedUser.getName());
        user.setPhone(updatedUser.getPhone());
        user.setAddress(updatedUser.getAddress());

        userRepository.save(user);

        return "Profile updated successfully";
    }

    // ===============================
    // CHANGE PASSWORD
    // ===============================
    @PostMapping("/change-password")
    public String changePassword(@RequestBody ChangePasswordRequest request,
                                 Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1️⃣ Check old password
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            return "Old password is incorrect";
        }

        // 2️⃣ Check new password match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return "New password and confirm password do not match";
        }

        // 3️⃣ Strong password validation
        String passwordError = validatePassword(request.getNewPassword());
        if (passwordError != null) {
            return passwordError;
        }

        // 4️⃣ Encode and save new password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return "Password changed successfully";
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
}
