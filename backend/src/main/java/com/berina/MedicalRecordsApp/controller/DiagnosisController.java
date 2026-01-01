package com.berina.MedicalRecordsApp.controller;

import com.berina.MedicalRecordsApp.model.Diagnosis;
import com.berina.MedicalRecordsApp.service.DiagnosisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diagnoses")
public class DiagnosisController {

    private final DiagnosisService diagnosisService;

    public DiagnosisController(DiagnosisService diagnosisService) {
        this.diagnosisService = diagnosisService;
    }


    @GetMapping
    public ResponseEntity<List<Diagnosis>> getAllDiagnoses() {
        return ResponseEntity.ok(diagnosisService.getAllDiagnoses());
    }


    @GetMapping("/{id}")
    public ResponseEntity<Diagnosis> getDiagnosisById(@PathVariable Long id) {
        return diagnosisService.getDiagnosisById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Diagnosis>> getDiagnosesByPatient(@PathVariable Long patientId) {
        List<Diagnosis> diagnoses = diagnosisService.getDiagnosesByPatientId(patientId);
        return ResponseEntity.ok(diagnoses);
    }


    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Diagnosis>> getDiagnosesByDoctor(@PathVariable Long doctorId) {
        List<Diagnosis> diagnoses = diagnosisService.getDiagnosesByDoctorId(doctorId);
        return ResponseEntity.ok(diagnoses);
    }


    @PostMapping
    public ResponseEntity<Diagnosis> addDiagnosis(@RequestBody Diagnosis diagnosis) {
        Diagnosis savedDiagnosis = diagnosisService.saveDiagnosis(diagnosis);
        return ResponseEntity.ok(savedDiagnosis);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Diagnosis> updateDiagnosis(
            @PathVariable Long id,
            @RequestBody Diagnosis updatedDiagnosis) {
        updatedDiagnosis.setId(id);
        Diagnosis saved = diagnosisService.saveDiagnosis(updatedDiagnosis);
        return ResponseEntity.ok(saved);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiagnosis(@PathVariable Long id) {
        diagnosisService.deleteDiagnosis(id);
        return ResponseEntity.noContent().build();
    }
}
