package com.berina.MedicalRecordsApp.controller;

import com.berina.MedicalRecordsApp.model.Bloodwork;
import com.berina.MedicalRecordsApp.service.BloodworkService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bloodworks")
public class BloodworkController {

    private final BloodworkService bloodworkService;

    public BloodworkController(BloodworkService bloodworkService) {
        this.bloodworkService = bloodworkService;
    }


    @GetMapping
    public ResponseEntity<List<Bloodwork>> getAllBloodworks() {
        return ResponseEntity.ok(bloodworkService.getAllBloodwork());
    }


    @GetMapping("/{id}")
    public ResponseEntity<Bloodwork> getBloodwork(@PathVariable Long id) {
        return bloodworkService.getBloodworkById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Bloodwork>> getBloodworksByUser(@PathVariable Long userId) {
        List<Bloodwork> bloodworks = bloodworkService.getBloodworkByUserId(userId);
        return ResponseEntity.ok(bloodworks);
    }


    @PostMapping
    public ResponseEntity<Bloodwork> addBloodwork(@RequestBody Bloodwork bloodwork) {
        Bloodwork saved = bloodworkService.saveBloodwork(bloodwork);
        return ResponseEntity.ok(saved);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Bloodwork> updateBloodwork(@PathVariable Long id, @RequestBody Bloodwork bloodwork) {
        bloodwork.setId(id);
        Bloodwork updated = bloodworkService.saveBloodwork(bloodwork);
        return ResponseEntity.ok(updated);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBloodwork(@PathVariable Long id) {
        bloodworkService.deleteBloodwork(id);
        return ResponseEntity.noContent().build();
    }
}
