package com.berina.MedicalRecordsApp.controller;

import com.berina.MedicalRecordsApp.model.Medication;
import com.berina.MedicalRecordsApp.service.MedicationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medications")
public class MedicationController {

    private final MedicationService medicationService;

    public MedicationController(MedicationService medicationService) {
        this.medicationService = medicationService;
    }

    @GetMapping
    public List<Medication> getAllMedications() {
        return medicationService.getAllMedications();
    }

    @GetMapping("/{id}")
    public Medication getMedication(@PathVariable Long id) {
        return medicationService.getMedicationById(id);
    }

    @PostMapping
    public Medication addMedication(@RequestBody Medication medication) {
        return medicationService.saveMedication(medication);
    }

    @PutMapping("/{id}")
    public Medication updateMedication(@PathVariable Long id, @RequestBody Medication medication) {
        medication.setId(id);
        return medicationService.saveMedication(medication);
    }

    @DeleteMapping("/{id}")
    public void deleteMedication(@PathVariable Long id) {
        medicationService.deleteMedication(id);
    }
}