package com.berina.MedicalRecordsApp.service;

import com.berina.MedicalRecordsApp.model.Notification;
import com.berina.MedicalRecordsApp.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;

    public NotificationService(NotificationRepository notificationRepository,
                               EmailService emailService) {
        this.notificationRepository = notificationRepository;
        this.emailService = emailService;
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Notification getNotificationById(Long id) {
        return notificationRepository.findById(id).orElse(null);
    }

    public List<Notification> getNotificationsByUserId(Long userId) {
        return notificationRepository.findByUser_Id(userId);
    }

    public Notification saveNotification(Notification notification) {
        if (notification.getCreatedAt() == null) {
            notification.setCreatedAt(LocalDateTime.now());
        }

        Notification saved = notificationRepository.save(notification);

        if (saved.getUser() != null && saved.getUser().getEmail() != null) {
            emailService.sendEmail(
                    saved.getUser().getEmail(),
                    "MediCorp Notification",
                    saved.getMessage()
            );
        }

        return saved;
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
}
