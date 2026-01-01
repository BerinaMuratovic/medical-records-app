package com.berina.MedicalRecordsApp.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Bloodwork {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate testDate;
    private Double ironLevel;
    private Double glucoseLevel;
    private Double cholesterolLevel;
    private Double hemoglobinLevel;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Bloodwork() {}

    public Bloodwork(LocalDate testDate, Double ironLevel, Double glucoseLevel,
                     Double cholesterolLevel, Double hemoglobinLevel, User user) {
        this.testDate = testDate;
        this.ironLevel = ironLevel;
        this.glucoseLevel = glucoseLevel;
        this.cholesterolLevel = cholesterolLevel;
        this.hemoglobinLevel = hemoglobinLevel;
        this.user = user;
    }

    public Long getId() { return id; }
    public LocalDate getTestDate() { return testDate; }
    public Double getIronLevel() { return ironLevel; }
    public Double getGlucoseLevel() { return glucoseLevel; }
    public Double getCholesterolLevel() { return cholesterolLevel; }
    public Double getHemoglobinLevel() { return hemoglobinLevel; }
    public User getUser() { return user; }

    public void setId(Long id) { this.id = id; }
    public void setTestDate(LocalDate testDate) { this.testDate = testDate; }
    public void setIronLevel(Double ironLevel) { this.ironLevel = ironLevel; }
    public void setGlucoseLevel(Double glucoseLevel) { this.glucoseLevel = glucoseLevel; }
    public void setCholesterolLevel(Double cholesterolLevel) { this.cholesterolLevel = cholesterolLevel; }
    public void setHemoglobinLevel(Double hemoglobinLevel) { this.hemoglobinLevel = hemoglobinLevel; }
    public void setUser(User user) { this.user = user; }
}