

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

    public BloodworkService(BloodworkRepository bloodworkRepository,
                            NotificationService notificationService,
                            UserRepository userRepository) {
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

        System.out.println("=== BLOODWORK SAVE TRIGGERED ===");

        if (bloodwork.getUser() == null || bloodwork.getUser().getId() == null) {
            throw new RuntimeException("Bloodwork must have a user!");
        }


        User user = userRepository.findById(bloodwork.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));


        bloodwork.setUser(user);

        boolean isUpdate = (bloodwork.getId() != null &&
                bloodworkRepository.existsById(bloodwork.getId()));

        Bloodwork saved = bloodworkRepository.save(bloodwork);

        System.out.println("Bloodwork saved.");
        System.out.println("User attached: " + saved.getUser().getEmail());

        String message = isUpdate
                ? "Bloodwork updated (" + saved.getTestDate() + ")"
                : "New bloodwork results available (" + saved.getTestDate() + ")";

        Notification notification = new Notification(
                message,
                LocalDateTime.now(),
                false,
                saved.getUser()
        );

        System.out.println("Creating notification...");
        notificationService.saveNotification(notification);

        return saved;
    }

    public void deleteBloodwork(Long id) {
        Optional<Bloodwork> existing = bloodworkRepository.findById(id);

        if (existing.isPresent()) {
            Bloodwork bloodwork = existing.get();

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
        }
    }
}
