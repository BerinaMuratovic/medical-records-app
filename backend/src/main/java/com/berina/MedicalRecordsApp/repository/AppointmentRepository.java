package com.berina.MedicalRecordsApp.repository;

import com.berina.MedicalRecordsApp.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatient_Id(Long patientId);
    List<Appointment> findByDoctor_Id(Long doctorId);

    long countByDateAfter(LocalDateTime date);
}
