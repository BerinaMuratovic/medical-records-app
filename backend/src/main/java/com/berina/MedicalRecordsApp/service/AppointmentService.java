package com.berina.MedicalRecordsApp.service;

import com.berina.MedicalRecordsApp.model.Appointment;
import com.berina.MedicalRecordsApp.model.Notification;
import com.berina.MedicalRecordsApp.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final NotificationService notificationService;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            NotificationService notificationService
    ) {
        this.appointmentRepository = appointmentRepository;
        this.notificationService = notificationService;
    }

    /* ================= GET ================= */

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id).orElse(null);
    }

    public List<Appointment> getAppointmentsByPatientId(Long patientId) {
        return appointmentRepository.findByPatient_Id(patientId);
    }

    public List<Appointment> getAppointmentsByDoctorId(Long doctorId) {
        return appointmentRepository.findByDoctor_Id(doctorId);
    }



    public Appointment saveAppointment(Appointment appointment) {
        boolean isUpdate =
                appointment.getId() != null &&
                        appointmentRepository.existsById(appointment.getId());

        Appointment saved = appointmentRepository.save(appointment);


        if (saved.getDoctor() != null && saved.getPatient() != null) {
            String message = isUpdate
                    ? "Appointment updated by patient: " + saved.getPatient().getName()
                    : "New appointment scheduled by patient: " + saved.getPatient().getName();

            Notification notification = new Notification(
                    message,
                    LocalDateTime.now(),
                    false,
                    saved.getDoctor()
            );

            notificationService.saveNotification(notification);
        }

        return saved;
    }

    /* ================= DELETE ================= */

    public void deleteAppointment(Long id) {
        Optional<Appointment> existing = appointmentRepository.findById(id);

        if (existing.isPresent()) {
            Appointment appointment = existing.get();


            if (appointment.getDoctor() != null && appointment.getPatient() != null) {
                Notification notification = new Notification(
                        "Appointment cancelled by patient: " + appointment.getPatient().getName(),
                        LocalDateTime.now(),
                        false,
                        appointment.getDoctor()
                );

                notificationService.saveNotification(notification);
            }

            appointmentRepository.deleteById(id);
        }
    }
}
