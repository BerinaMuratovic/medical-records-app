package com.berina.MedicalRecordsApp.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "prescribed_by_id", nullable = false)
    private User prescribedBy;

    @ManyToOne
    @JoinColumn(name = "medication_id", nullable = false)
    private Medication medication;

    private String dosage;
    private String frequency;
    private LocalDate startDate;
    private LocalDate endDate;

    public Prescription() {}

    public Prescription(User user, User prescribedBy, Medication medication, String dosage, String frequency, LocalDate startDate, LocalDate endDate) {
        this.user = user;
        this.prescribedBy = prescribedBy;
        this.medication = medication;
        this.dosage = dosage;
        this.frequency = frequency;
        this.startDate = startDate;
        this.endDate = endDate;
    }


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public User getPrescribedBy() { return prescribedBy; }
    public void setPrescribedBy(User prescribedBy) { this.prescribedBy = prescribedBy; }

    public Medication getMedication() { return medication; }
    public void setMedication(Medication medication) { this.medication = medication; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
}
