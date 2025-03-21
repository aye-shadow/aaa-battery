package com.aaa_battery.aaa_batteryproject.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.aaa_battery.aaa_batteryproject.user.model.UserEntity;
import com.aaa_battery.aaa_batteryproject.user.repository.UserRepository;

import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserEntity userEntity) {
        try {
            // Save the user to the database
            userRepository.save(userEntity);
            return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error registering user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestParam String email, @RequestParam String password) {
        try {
            // Find the user by email
            Optional<UserEntity> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                UserEntity user = userOptional.get();
                // Check if the password matches
                if (user.getPassword().equals(password)) {
                    return new ResponseEntity<>("Login successful", HttpStatus.OK);
                } else {
                    return new ResponseEntity<>("Invalid password", HttpStatus.UNAUTHORIZED);
                }
            } else {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error during login: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> authenticatedUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()) {
                return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
            }

            // Assuming authentication principal returns UserEntity
            UserEntity currentUser = (UserEntity) authentication.getPrincipal();

            // Hide sensitive data before returning
            UserEntity safeUser = new UserEntity();
            safeUser.setId(currentUser.getId());
            safeUser.setEmail(currentUser.getEmail());
            safeUser.setUsername(currentUser.getUsername());

            return ResponseEntity.ok(safeUser);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving user info: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/")
    public ResponseEntity<?> allUsers() {
        try {
            List<UserEntity> users = userRepository.findAll();

            if (users.isEmpty()) {
                return new ResponseEntity<>("No users found", HttpStatus.NOT_FOUND);
            }

            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving users: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}