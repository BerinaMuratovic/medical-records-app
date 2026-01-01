package com.berina.MedicalRecordsApp.repository;

import com.berina.MedicalRecordsApp.model.Notification;
import com.berina.MedicalRecordsApp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUser_Id(Long userId);


}
