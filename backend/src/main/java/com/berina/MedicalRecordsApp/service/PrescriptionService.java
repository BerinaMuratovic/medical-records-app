package com.berina.MedicalRecordsApp.service;

import com.berina.MedicalRecordsApp.model.Notification;
import com.berina.MedicalRecordsApp.model.Prescription;
import com.berina.MedicalRecordsApp.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final NotificationService notificationService;

    public PrescriptionService(PrescriptionRepository prescriptionRepository, NotificationService notificationService) {
        this.prescriptionRepository = prescriptionRepository;
        this.notificationService = notificationService;
    }


    public Prescription savePrescription(Prescription prescription) {
        boolean isUpdate = (prescription.getId() != null && prescriptionRepository.existsById(prescription.getId()));
        Prescription saved = prescriptionRepository.save(prescription);

        if (saved.getUser() != null && saved.getMedication() != null) {
            String message = isUpdate
                    ? "Prescription updated: " + saved.getMedication().getName()
                    : "A new prescription was added: " + saved.getMedication().getName();

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


    public void deletePrescription(Long id) {
        Optional<Prescription> existing = prescriptionRepository.findById(id);
        if (existing.isPresent()) {
            Prescription prescription = existing.get();

            if (prescription.getUser() != null && prescription.getMedication() != null) {
                Notification notification = new Notification(
                        "Prescription removed: " + prescription.getMedication().getName(),
                        LocalDateTime.now(),
                        false,
                        prescription.getUser()
                );
                notificationService.saveNotification(notification);
            }

            prescriptionRepository.deleteById(id);
        }
    }

    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    public Optional<Prescription> getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id);
    }

    public List<Prescription> getPrescriptionsByUserId(Long userId) {
        return prescriptionRepository.findByUser_Id(userId);
    }

    public List<Prescription> getPrescriptionsByDoctorId(Long doctorId) {
        return prescriptionRepository.findByPrescribedBy_Id(doctorId);
    }
}
