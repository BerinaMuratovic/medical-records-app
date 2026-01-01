package com.berina.MedicalRecordsApp.service;

import com.berina.MedicalRecordsApp.model.Bloodwork;
import com.berina.MedicalRecordsApp.model.Notification;
import com.berina.MedicalRecordsApp.repository.BloodworkRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BloodworkService {

    private final BloodworkRepository bloodworkRepository;
    private final NotificationService notificationService;

    public BloodworkService(BloodworkRepository bloodworkRepository,
                            NotificationService notificationService) {
        this.bloodworkRepository = bloodworkRepository;
        this.notificationService = notificationService;
    }

    public List<Bloodwork> getAllBloodwork() {
        return bloodworkRepository.findAll();
    }

    public Optional<Bloodwork> getBloodworkById(Long id) {
        return bloodworkRepository.findById(id);
    }

    public List<Bloodwork> getBloodworkByUserId(Long userId) {

        return bloodworkRepository.findByUser_Id(userId)
                .stream()
                .filter(b -> b.getUser() != null)
                .toList();
    }


    public Bloodwork saveBloodwork(Bloodwork bloodwork) {
        boolean isUpdate = (bloodwork.getId() != null &&
                bloodworkRepository.existsById(bloodwork.getId()));

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
