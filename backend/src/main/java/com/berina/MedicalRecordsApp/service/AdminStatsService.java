package com.berina.MedicalRecordsApp.service;

import com.berina.MedicalRecordsApp.repository.AppointmentRepository;
import com.berina.MedicalRecordsApp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class AdminStatsService {

    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;

    public AdminStatsService(UserRepository userRepository,
                             AppointmentRepository appointmentRepository) {
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public Map<String, Object> getDashboardStats(int periodDays) {

        Map<String, Object> stats = new HashMap<>();

        LocalDateTime now = LocalDateTime.now();

        LocalDateTime currentFrom = now.minusDays(periodDays);

        LocalDateTime previousFrom = currentFrom.minusDays(periodDays);
        LocalDateTime previousTo = currentFrom;

        long currentUsers =
                userRepository.countByCreatedAtAfter(currentFrom);

        long previousUsers =
                userRepository.countByCreatedAtBetween(previousFrom, previousTo);

        long appointments =
                appointmentRepository.countByDateAfter(currentFrom);

        double growth = 0;

        if (previousUsers > 0) {
            growth = ((double) (currentUsers - previousUsers) / previousUsers) * 100;
        } else if (currentUsers > 0) {

            growth = 100;
        }

        stats.put("newUsers", currentUsers);
        stats.put("appointments", appointments);
        stats.put("userGrowth", Math.round(growth));

        return stats;
    }
}
