package com.berina.MedicalRecordsApp.repository;

import com.berina.MedicalRecordsApp.model.Role;
import com.berina.MedicalRecordsApp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByCreatedAtAfter(LocalDateTime date);

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    long countByRole(Role role);


    List<User> findByRole(Role role);
}
