package com.berina.MedicalRecordsApp.service;

import com.berina.MedicalRecordsApp.model.Appointment;
import com.berina.MedicalRecordsApp.model.Notification;
import com.berina.MedicalRecordsApp.repository.AppointmentRepository;
import com.berina.MedicalRecordsApp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            NotificationService notificationService,
            UserRepository userRepository
    ) {
        this.appointmentRepository = appointmentRepository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

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


        if (appointment.getPatient() != null && appointment.getPatient().getId() != null) {
            appointment.setPatient(
                    userRepository.findById(appointment.getPatient().getId()).orElse(null)
            );
        }


        if (appointment.getDoctor() != null && appointment.getDoctor().getId() != null) {
            appointment.setDoctor(
                    userRepository.findById(appointment.getDoctor().getId()).orElse(null)
            );
        }

        Appointment saved = appointmentRepository.save(appointment);

        if (saved.getDoctor() != null && saved.getDoctor().getEmail() != null) {

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
        } else {
            System.out.println("❌ Appointment email skipped — doctor or email is null");
        }

        return saved;
    }

    public void deleteAppointment(Long id) {
        appointmentRepository.findById(id).ifPresent(appointment -> {

            if (appointment.getDoctor() != null && appointment.getDoctor().getEmail() != null) {

                Notification notification = new Notification(
                        "Appointment cancelled by patient: " + appointment.getPatient().getName(),
                        LocalDateTime.now(),
                        false,
                        appointment.getDoctor()
                );

                notificationService.saveNotification(notification);
            }

            appointmentRepository.deleteById(id);
        });
    }
}
