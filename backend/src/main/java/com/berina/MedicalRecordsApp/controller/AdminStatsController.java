package com.berina.MedicalRecordsApp.controller;

import com.berina.MedicalRecordsApp.service.AdminStatsService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/stats")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminStatsController {

    private final AdminStatsService adminStatsService;

    public AdminStatsController(AdminStatsService adminStatsService) {
        this.adminStatsService = adminStatsService;
    }

    @GetMapping
    public Map<String, Object> getStats(
            @RequestParam(defaultValue = "30") int days
    ) {
        return adminStatsService.getDashboardStats(days);
    }
}
