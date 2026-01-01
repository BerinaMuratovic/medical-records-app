package com.berina.MedicalRecordsApp.repository;

import com.berina.MedicalRecordsApp.model.Medication;
import com.berina.MedicalRecordsApp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicationRepository extends JpaRepository<Medication, Long> {

}