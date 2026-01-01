package com.berina.MedicalRecordsApp.repository;

import com.berina.MedicalRecordsApp.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByUser_Id(Long userId);
    List<Prescription> findByPrescribedBy_Id(Long doctorId);
}
