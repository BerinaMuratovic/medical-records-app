package com.berina.MedicalRecordsApp.repository;

import com.berina.MedicalRecordsApp.model.Bloodwork;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BloodworkRepository extends JpaRepository<Bloodwork, Long> {
    List<Bloodwork> findByUser_Id(Long userId);
}
