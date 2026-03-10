package com.ewaste.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Locale;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.mail.enabled:true}")
    private boolean mailEnabled;

    public void sendOtpEmail(String toEmail, String otp) {

        // If mail disabled → print OTP in console
        if (!mailEnabled) {
            System.out.println("DEV OTP for " + toEmail + ": " + otp);
            return;
        }

        try {

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("♻️ Smart E-Waste Management — Email Verification OTP");

            // 🌿 HTML EMAIL TEMPLATE
            String body = """
                <html>
                <body style="font-family: Arial, sans-serif;
                             background-color:#f4f6f8;
                             padding:20px;">

                    <div style="
                        max-width:600px;
                        margin:auto;
                        background:white;
                        border-radius:10px;
                        padding:30px;
                        box-shadow:0 0 10px rgba(0,0,0,0.1);">

                        <h2 style="
                            color:#2e7d32;
                            text-align:center;">
                            ♻️ Smart E-Waste Management
                        </h2>

                        <p>Hello User,</p>

                        <p>
                            Thank you for registering with the
                            <b>Smart E-Waste Collection & Management System</b>.
                        </p>

                        <p>
                            Please use the OTP below to verify your email:
                        </p>

                        <div style="
                            text-align:center;
                            margin:30px 0;">

                            <span style="
                                font-size:28px;
                                letter-spacing:5px;
                                background:#e8f5e9;
                                padding:15px 25px;
                                border-radius:8px;
                                color:#1b5e20;
                                font-weight:bold;">
                                """ + otp + """
                            </span>
                        </div>

                        <p>
                            This OTP is valid for <b>5 minutes</b>.
                        </p>

                        <p>
                            If you did not request this,
                            please ignore this email.
                        </p>

                        <hr style="margin:30px 0;">

                        <p style="
                            font-size:12px;
                            color:gray;
                            text-align:center;">
                            © 2026 Smart E-Waste Management System <br>
                            Promoting Responsible Recycling 🌍
                        </p>

                    </div>
                </body>
                </html>
                """;

            // TRUE → send as HTML
            helper.setText(body, true);

            mailSender.send(message);

        } catch (MessagingException | MailException e) {
            e.printStackTrace();
        }
    }

    public void sendPickupScheduleEmail(
            String toEmail,
            Long requestId,
            String deviceLabel,
            LocalDate pickupDate,
            LocalTime pickupTime,
            String personnelName
    ) {
        if (!mailEnabled) {
            System.out.printf("DEV MAIL pickup schedule -> %s | request=%d | device=%s | %s %s | personnel=%s%n",
                    toEmail, requestId, deviceLabel, pickupDate, pickupTime, personnelName);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(toEmail);
            helper.setSubject("E-Waste Pickup Scheduled");

            String slotLabel = formatPickupSlot(pickupTime);

            String body = """
                <html>
                <body style="margin:0; padding:24px; background:#eef3ef; font-family:Arial,sans-serif; color:#24332f;">
                  <div style="max-width:560px; margin:0 auto; background:#ffffff; border:1px solid #d9e4dd; border-radius:0; overflow:hidden;">
                    <div style="background:#2f776f; padding:22px 28px; text-align:center; color:#ffffff; font-size:18px; font-weight:800;">
                      ♻ E-Waste Loop
                    </div>

                    <div style="padding:22px 18px 28px 18px;">
                      <div style="font-size:28px; line-height:1; margin-bottom:12px;">🚚</div>
                      <div style="font-size:28px; font-weight:800; color:#1f2b28; margin-bottom:8px;">Pickup Scheduled!</div>
                      <p style="margin:0 0 18px 0; color:#70807b; font-size:14px; line-height:1.5;">
                        Great news! A pickup has been scheduled for your e-waste request.
                      </p>

                      <div style="border:1px solid #e3e9e4; border-radius:14px; padding:18px 16px; background:#ffffff;">
                        <p style="margin:0 0 10px 0; color:#364541; font-size:14px;"><b>Request ID:</b> #%d</p>
                        <p style="margin:0 0 16px 0; color:#364541; font-size:14px;"><b>Device:</b> %s</p>

                        <div style="background:#edf6ee; border-radius:10px; padding:16px 14px;">
                          <p style="margin:0 0 10px 0; color:#314540; font-size:14px;"><b>📅 Date:</b> %s</p>
                          <p style="margin:0 0 10px 0; color:#314540; font-size:14px;"><b>🕘 Time:</b> %s</p>
                          <p style="margin:0; color:#314540; font-size:14px;"><b>👤 Contact Person:</b> %s</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(
                    requestId,
                    deviceLabel == null || deviceLabel.isBlank() ? "Your e-waste device" : deviceLabel,
                    pickupDate,
                    slotLabel,
                    personnelName == null || personnelName.isBlank() ? "To be assigned" : personnelName
            );

            helper.setText(body, true);
            mailSender.send(message);
        } catch (MessagingException | MailException e) {
            e.printStackTrace();
        }
    }

    public void sendStatusUpdateEmail(String toEmail, Long requestId, String status) {
        sendStatusUpdateEmail(toEmail, requestId, status, null);
    }

    public void sendStatusUpdateEmail(String toEmail, Long requestId, String status, String adminDetail) {
        if (!mailEnabled) {
            System.out.printf("DEV MAIL status update -> %s | request=%d | status=%s | detail=%s%n", toEmail, requestId, status, adminDetail);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            String normalizedStatus = status == null ? "PENDING" : status.trim().toUpperCase(Locale.ROOT);
            helper.setTo(toEmail);
            helper.setSubject("Smart E-Waste Management - " + statusHeadline(normalizedStatus));

            String body = """
                <html>
                <body style="margin:0; padding:24px; background:#f1f5f9; font-family:Arial,sans-serif; color:#0f172a;">
                    <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; overflow:hidden; box-shadow:0 10px 24px rgba(15,23,42,0.08);">
                        <div style="padding:18px 22px; background:linear-gradient(120deg,#0f766e 0%%,#14b8a6 100%%);">
                            <div style="font-size:12px; letter-spacing:0.08em; text-transform:uppercase; color:#ccfbf1; font-weight:700;">Smart E-Waste Management</div>
                            <div style="margin-top:6px; font-size:22px; line-height:1.2; color:#ffffff; font-weight:800;">Request Status Updated</div>
                            <div style="margin-top:4px; font-size:13px; color:#ccfbf1;">Real-time update on your pickup lifecycle.</div>
                        </div>

                        <div style="padding:22px;">
                            <p style="margin:0 0 12px 0; color:#334155;">Hello User,</p>
                            <p style="margin:0 0 16px 0; color:#334155;">%s</p>

                            <div style="background:%s; border:1px solid %s; border-left:5px solid %s; border-radius:10px; padding:14px 16px; margin:14px 0 16px 0;">
                                <p style="margin:6px 0; color:#1e293b;"><b>Request ID:</b> #%d</p>
                                <p style="margin:6px 0; color:#1e293b;"><b>Updated Status:</b> %s</p>
                                <div style="margin-top:10px;">
                                    <span style="display:inline-block; background:#ffffff; color:%s; border:1px solid #e2e8f0; border-radius:999px; padding:6px 12px; font-size:12px; font-weight:700;">
                                        %s
                                    </span>
                                </div>
                            </div>

                            <div style="margin-top:14px; background:#f8fafc; border:1px dashed #cbd5e1; border-radius:10px; padding:12px 14px;">
                                <p style="margin:0; color:#475569; font-size:13px;"><b>What next:</b> %s</p>
                            </div>

                            <div style="margin-top:14px; background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:12px 14px;">
                                <p style="margin:0 0 8px 0; color:#334155; font-size:13px;"><b>Update details:</b></p>
                                <p style="margin:0; color:#475569; font-size:13px; line-height:1.5;">%s</p>
                            </div>

                            <p style="margin:16px 0 0 0; color:#475569; font-size:13px; line-height:1.5;">
                                You can continue tracking this request from your dashboard.
                                If you need assistance, reply to this email and our support team will help.
                            </p>
                        </div>

                        <div style="border-top:1px solid #e2e8f0; padding:12px 22px 16px 22px; text-align:center; font-size:12px; color:#64748b;">
                            &copy; 2026 Smart E-Waste Management System<br>
                            Promoting Responsible Recycling
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(
                    statusMessage(normalizedStatus),
                    statusBackground(normalizedStatus),
                    statusBorder(normalizedStatus),
                    statusBorder(normalizedStatus),
                    requestId,
                    titleCase(normalizedStatus),
                    statusAccent(normalizedStatus),
                    statusHeadline(normalizedStatus),
                    nextStepText(normalizedStatus),
                    statusDetails(normalizedStatus, adminDetail)
            );

            helper.setText(body, true);
            mailSender.send(message);
        } catch (MessagingException | MailException e) {
            e.printStackTrace();
        }
    }

    private String statusMessage(String status) {
        return switch (status) {
            case "ACCEPTED" -> "Great news. Your request has been accepted by our team.";
            case "REJECTED" -> "Your request could not be approved at this time.";
            case "SCHEDULED", "PICKUP_SCHEDULED" -> "Your pickup has been planned and moved to scheduled state.";
            case "PICKED_UP" -> "Pickup completed successfully. Thank you for recycling responsibly.";
            case "SUBMITTED", "PENDING" -> "Your request is currently in review.";
            default -> "There is an update on your e-waste pickup request.";
        };
    }

    private String nextStepText(String status) {
        return switch (status) {
            case "ACCEPTED" -> "You will receive scheduling details shortly.";
            case "REJECTED" -> "Please review request details and submit a fresh request if needed.";
            case "SCHEDULED", "PICKUP_SCHEDULED" -> "Keep the items packed and ready before pickup time.";
            case "PICKED_UP" -> "No action required from your side.";
            case "SUBMITTED", "PENDING" -> "Our admin team will review and notify you soon.";
            default -> "Please check your dashboard for complete request details.";
        };
    }

    private String statusDetails(String status, String adminDetail) {
        return switch (status) {
            case "ACCEPTED" -> "Your request passed initial verification. Our operations team will now assign pickup slot and personnel.";
            case "REJECTED" -> adminDetail == null || adminDetail.isBlank()
                    ? "This may happen when key pickup details are incomplete or the item category is not currently serviceable in your area."
                    : "Reason provided by admin: " + adminDetail;
            case "SCHEDULED", "PICKUP_SCHEDULED" -> "Please ensure the listed items are accessible, packed safely, and available at the scheduled location and time.";
            case "PICKED_UP" -> "Collected items will be routed through our recycling and recovery workflow with environmentally responsible handling.";
            case "SUBMITTED", "PENDING" -> "Your request is in queue for review. We validate item details, location coverage, and scheduling availability.";
            default -> "Your request timeline has a new update. Please check your dashboard for the latest activity and history.";
        };
    }

    private String statusHeadline(String status) {
        return switch (status) {
            case "ACCEPTED" -> "Request Accepted";
            case "REJECTED" -> "Request Rejected";
            case "SCHEDULED", "PICKUP_SCHEDULED" -> "Pickup Scheduled";
            case "PICKED_UP" -> "Pickup Completed";
            case "SUBMITTED", "PENDING" -> "Request In Review";
            default -> "Status Updated";
        };
    }

    private String statusBackground(String status) {
        return switch (status) {
            case "ACCEPTED" -> "#ecfdf3";
            case "REJECTED" -> "#fef2f2";
            case "SCHEDULED", "PICKUP_SCHEDULED" -> "#eff6ff";
            case "PICKED_UP" -> "#eef2ff";
            case "SUBMITTED", "PENDING" -> "#fffbeb";
            default -> "#f8fafc";
        };
    }

    private String statusBorder(String status) {
        return switch (status) {
            case "ACCEPTED" -> "#22c55e";
            case "REJECTED" -> "#ef4444";
            case "SCHEDULED", "PICKUP_SCHEDULED" -> "#3b82f6";
            case "PICKED_UP" -> "#6366f1";
            case "SUBMITTED", "PENDING" -> "#f59e0b";
            default -> "#94a3b8";
        };
    }

    private String statusAccent(String status) {
        return switch (status) {
            case "ACCEPTED" -> "#166534";
            case "REJECTED" -> "#991b1b";
            case "SCHEDULED", "PICKUP_SCHEDULED" -> "#1d4ed8";
            case "PICKED_UP" -> "#3730a3";
            case "SUBMITTED", "PENDING" -> "#92400e";
            default -> "#334155";
        };
    }

    private String titleCase(String value) {
        String[] parts = value.toLowerCase(Locale.ROOT).split("_");
        StringBuilder out = new StringBuilder();
        for (String part : parts) {
            if (part.isBlank()) {
                continue;
            }
            if (out.length() > 0) {
                out.append(' ');
            }
            out.append(Character.toUpperCase(part.charAt(0)));
            if (part.length() > 1) {
                out.append(part.substring(1));
            }
        }
        return out.length() == 0 ? value : out.toString();
    }

    private String formatPickupSlot(LocalTime pickupTime) {
        if (pickupTime == null) {
            return "To be assigned";
        }

        return switch (pickupTime.toString()) {
            case "09:00", "09:00:00" -> "Morning (9:00 AM - 12:00 PM)";
            case "12:00", "12:00:00" -> "Noon (12:00 PM - 03:00 PM)";
            case "15:00", "15:00:00" -> "Afternoon (3:00 PM - 06:00 PM)";
            case "18:00", "18:00:00" -> "Evening (6:00 PM - 09:00 PM)";
            default -> pickupTime.toString();
        };
    }
}
