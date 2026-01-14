

package com.berina.MedicalRecordsApp.service;

import com.berina.MedicalRecordsApp.model.Bloodwork;
import com.berina.MedicalRecordsApp.model.Notification;
import com.berina.MedicalRecordsApp.model.User;
import com.berina.MedicalRecordsApp.repository.BloodworkRepository;
import com.berina.MedicalRecordsApp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BloodworkService {

    private final BloodworkRepository bloodworkRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public BloodworkService(
            BloodworkRepository bloodworkRepository,
            NotificationService notificationService,
            UserRepository userRepository
    ) {
        this.bloodworkRepository = bloodworkRepository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    public List<Bloodwork> getAllBloodwork() {
        return bloodworkRepository.findAll();
    }

    public Optional<Bloodwork> getBloodworkById(Long id) {
        return bloodworkRepository.findById(id);
    }

    public List<Bloodwork> getBloodworkByUserId(Long userId) {
        return bloodworkRepository.findByUser_Id(userId);
    }

    public Bloodwork saveBloodwork(Bloodwork bloodwork) {

        boolean isUpdate = bloodwork.getId() != null &&
                bloodworkRepository.existsById(bloodwork.getId());

        
        if (bloodwork.getUser() != null && bloodwork.getUser().getId() != null) {
            userRepository.findById(bloodwork.getUser().getId())
                    .ifPresent(bloodwork::setUser);
        }

        Bloodwork saved = bloodworkRepository.save(bloodwork);

        if (saved.getUser() != null) {

            String message = isUpdate
                    ? "Bloodwork updated (" + saved.getTestDate() + ")"
                    : "New bloodwork results available (" + saved.getTestDate() + ")";

            Notification notification = new Notification(
                    message,
                    LocalDateTime.now(),
                    false,
                    saved.getUser()
            );

            notificationService.saveNotification(notification);
        }

        return saved;
    }

    public void deleteBloodwork(Long id) {
        bloodworkRepository.findById(id).ifPresent(bloodwork -> {

            if (bloodwork.getUser() != null) {
                Notification notification = new Notification(
                        "Bloodwork record removed (" + bloodwork.getTestDate() + ")",
                        LocalDateTime.now(),
                        false,
                        bloodwork.getUser()
                );
                notificationService.saveNotification(notification);
            }

            bloodworkRepository.deleteById(id);
        });
    }
}
