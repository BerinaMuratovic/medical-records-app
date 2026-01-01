package com.berina.MedicalRecordsApp.controller;

import com.berina.MedicalRecordsApp.service.EmailService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/email")
public class EmailTestController {

    private final EmailService emailService;

    public EmailTestController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping("/test")
    public String testEmail() {
        emailService.sendEmail(
                "berinamuratovic14@gmail.com",
                "Test Email",
                "If you received this email, email sending works!"
        );
        return "Email sent successfully";
    }
}
