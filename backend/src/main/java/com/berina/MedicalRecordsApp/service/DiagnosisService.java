package com.berina.MedicalRecordsApp.service;

import com.berina.MedicalRecordsApp.model.Diagnosis;
import com.berina.MedicalRecordsApp.model.Notification;
import com.berina.MedicalRecordsApp.repository.DiagnosisRepository;
import com.berina.MedicalRecordsApp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DiagnosisService {

    private final DiagnosisRepository diagnosisRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public DiagnosisService(
            DiagnosisRepository diagnosisRepository,
            NotificationService notificationService,
            UserRepository userRepository
    ) {
        this.diagnosisRepository = diagnosisRepository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    public Diagnosis saveDiagnosis(Diagnosis diagnosis) {

        boolean isUpdate =
                diagnosis.getId() != null &&
                        diagnosisRepository.existsById(diagnosis.getId());


        if (diagnosis.getPatient() != null && diagnosis.getPatient().getId() != null) {
            diagnosis.setPatient(
                    userRepository.findById(diagnosis.getPatient().getId()).orElse(null)
            );
        }

        Diagnosis saved = diagnosisRepository.save(diagnosis);

        if (saved.getPatient() != null && saved.getPatient().getEmail() != null) {

            String message = isUpdate
                    ? "Diagnosis updated: " + saved.getTitle()
                    : "New diagnosis added: " + saved.getTitle();

            Notification notification = new Notification(
                    message,
                    LocalDateTime.now(),
                    false,
                    saved.getPatient()
            );

            notificationService.saveNotification(notification);
        } else {
            System.out.println("❌ Diagnosis email skipped — patient or email is null");
        }

        return saved;
    }

    public void deleteDiagnosis(Long id) {
        diagnosisRepository.findById(id).ifPresent(diagnosis -> {

            if (diagnosis.getPatient() != null && diagnosis.getPatient().getEmail() != null) {
                Notification notification = new Notification(
                        "Diagnosis removed: " + diagnosis.getTitle(),
                        LocalDateTime.now(),
                        false,
                        diagnosis.getPatient()
                );
                notificationService.saveNotification(notification);
            }

            diagnosisRepository.deleteById(id);
        });
    }
}
