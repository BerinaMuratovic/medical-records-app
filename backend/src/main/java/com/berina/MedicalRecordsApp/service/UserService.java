package com.berina.MedicalRecordsApp.service;

import com.berina.MedicalRecordsApp.model.Notification;
import com.berina.MedicalRecordsApp.model.Role;
import com.berina.MedicalRecordsApp.model.User;
import com.berina.MedicalRecordsApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /* ================= GETTERS ================= */

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public Optional<User> getById(Long id) {
        return userRepository.findById(id);
    }

    /* ================= REGISTER USER ================= */

    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User saved = userRepository.save(user);

        notifyAdmins(
                "New user registered: " + saved.getName() + " (" + saved.getRole() + ")"
        );

        return saved;
    }

    /* ================= LOGIN ================= */

    public User loginUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user;
            }
        }
        return null;
    }

    /* ================= UPDATE USER ================= */

    public Optional<User> updateUser(Long id, User updates) {
        return userRepository.findById(id).map(existingUser -> {

            boolean roleChanged =
                    updates.getRole() != null &&
                            existingUser.getRole() != updates.getRole();

            if (updates.getName() != null && !updates.getName().isBlank()) {
                existingUser.setName(updates.getName());
            }

            if (updates.getPassword() != null && !updates.getPassword().isBlank()) {
                existingUser.setPassword(
                        passwordEncoder.encode(updates.getPassword())
                );
            }

            if (updates.getProfilePic() != null) {
                existingUser.setProfilePic(updates.getProfilePic());
            }

            if (updates.getRole() != null) {
                existingUser.setRole(updates.getRole());
            }

            User saved = userRepository.save(existingUser);

            if (roleChanged) {
                notifyAdmins(
                        "User role changed: " + saved.getName() + " → " + saved.getRole()
                );
            }

            return saved;
        });
    }

    /* ================= DELETE USER ================= */

    public void deleteUser(Long id) {
        userRepository.findById(id).ifPresent(user -> {
            userRepository.deleteById(id);
            notifyAdmins(
                    "User deleted: " + user.getName() + " (" + user.getRole() + ")"
            );
        });
    }

    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }

    /* ================= ADMIN NOTIFICATIONS ================= */

    private void notifyAdmins(String message) {
        List<User> admins = userRepository.findAll()
                .stream()
                .filter(u -> u.getRole() == Role.ADMIN)
                .toList();

        for (User admin : admins) {
            Notification notification = new Notification(
                    message,
                    LocalDateTime.now(),
                    false,
                    admin
            );


            notificationService.saveNotification(notification);
        }
    }
}
