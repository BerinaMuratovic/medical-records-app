package com.berina.MedicalRecordsApp.service;

import com.berina.MedicalRecordsApp.model.Diagnosis;
import com.berina.MedicalRecordsApp.model.Notification;
import com.berina.MedicalRecordsApp.model.User;
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

    /* ================= GET ================= */

    public List<Diagnosis> getAllDiagnoses() {
        return diagnosisRepository.findAll();
    }

    public Optional<Diagnosis> getDiagnosisById(Long id) {
        return diagnosisRepository.findById(id);
    }

    public List<Diagnosis> getDiagnosesByPatientId(Long patientId) {
        return diagnosisRepository.findByPatient_Id(patientId);
    }

    public List<Diagnosis> getDiagnosesByDoctorId(Long doctorId) {
        return diagnosisRepository.findByDoctor_Id(doctorId);
    }

    /* ================= SAVE / UPDATE ================= */

    public Diagnosis saveDiagnosis(Diagnosis diagnosis) {

        boolean isUpdate =
                diagnosis.getId() != null &&
                        diagnosisRepository.existsById(diagnosis.getId());

        // Load full patient entity
        if (diagnosis.getPatient() != null && diagnosis.getPatient().getId() != null) {
            User patient = userRepository.findById(diagnosis.getPatient().getId()).orElse(null);
            diagnosis.setPatient(patient);
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

    /* ================= DELETE ================= */

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
