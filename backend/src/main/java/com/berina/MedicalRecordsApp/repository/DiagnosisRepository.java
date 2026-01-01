package com.berina.MedicalRecordsApp.repository;

import com.berina.MedicalRecordsApp.model.Diagnosis;
import com.berina.MedicalRecordsApp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DiagnosisRepository extends JpaRepository<Diagnosis, Long> {
    List<Diagnosis> findByPatient_Id(Long patientId);
    List<Diagnosis> findByDoctor_Id(Long doctorId);
}
