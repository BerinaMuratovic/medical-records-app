package com.berina.MedicalRecordsApp.service;

import com.berina.MedicalRecordsApp.model.Notification;
import com.berina.MedicalRecordsApp.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;

    public NotificationService(NotificationRepository notificationRepository,
                               EmailService emailService) {
        this.notificationRepository = notificationRepository;
        this.emailService = emailService;
    }

    public Notification saveNotification(Notification notification) {

        System.out.println("=== NOTIFICATION SAVE TRIGGERED ===");

        if (notification.getCreatedAt() == null) {
            notification.setCreatedAt(LocalDateTime.now());
        }

        Notification saved = notificationRepository.save(notification);

        System.out.println("Notification saved.");
        System.out.println("User attached: " +
                (saved.getUser() != null ? saved.getUser().getEmail() : "NULL USER"));

        if (saved.getUser() != null && saved.getUser().getEmail() != null) {
            System.out.println("Calling EmailService...");
            emailService.sendEmail(
                    saved.getUser().getEmail(),
                    "MediCorp Notification",
                    saved.getMessage()
            );
        } else {
            System.out.println("EMAIL NOT SENT — user or email is null");
        }

        return saved;
    }
}
