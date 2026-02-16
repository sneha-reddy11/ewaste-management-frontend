package com.infosys.ewaste.auth;

import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpMail(String toEmail, String otp) {

        try {

            String subject = "OTP Verification - E-Waste Management System";

            String htmlContent = """
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f6f9;">
                    <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        
                        <h2 style="color: #2e7d32; text-align: center;">
                            E-Waste Management System
                        </h2>

                        <p>Hello,</p>

                        <p>Your One-Time Password (OTP) is:</p>

                        <div style="
                            font-size: 26px;
                            font-weight: bold;
                            color: white;
                            background-color: #1976d2;
                            padding: 12px;
                            text-align: center;
                            border-radius: 6px;
                            letter-spacing: 3px;
                            margin: 15px 0;
                        ">
                            """ + otp + """
                        </div>

                        <p>This OTP is valid for <strong>10 minutes</strong>.</p>

                        <p>If you did not request this, please ignore this email.</p>

                        <hr style="margin: 20px 0;">

                        <p style="font-size: 12px; color: gray; text-align: center;">
                            © 2026 E-Waste Management System | Infosys Internship Project
                        </p>

                    </div>
                </div>
                """;

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true = HTML email

            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Failed to send email");
        }
    }
}
