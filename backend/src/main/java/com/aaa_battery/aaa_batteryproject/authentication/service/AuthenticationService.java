package com.aaa_battery.aaa_batteryproject.authentication.service;

import com.aaa_battery.aaa_batteryproject.user.dtos.LoginUserDto;
import com.aaa_battery.aaa_batteryproject.user.dtos.RegisterUserDto;
import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;
import com.aaa_battery.aaa_batteryproject.user.model.LibrarianEntity;
import com.aaa_battery.aaa_batteryproject.user.model.UserEntity;
import com.aaa_battery.aaa_batteryproject.user.repositories.UserRepository;
import com.aaa_battery.aaa_batteryproject.user.roles.Role;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    
    private final PasswordEncoder passwordEncoder;
    
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
        UserRepository userRepository,
        AuthenticationManager authenticationManager,
        PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserEntity signup(RegisterUserDto input) {
        if (input.getFullName() == null || input.getFullName().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (input.getEmail() == null || input.getEmail().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (input.getPassword() == null || input.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (input.getRole() == null || !isValidRole(input.getRole().name())) {
            throw new IllegalArgumentException("Invalid role");
        }

        UserEntity user;
        if (input.getRole().equals(Role.BORROWER)) {
            user = new BorrowerEntity();
        } else if (input.getRole().equals(Role.LIBRARIAN)) {
            user = new LibrarianEntity();
        } else {
            throw new IllegalArgumentException("Unsupported role.");
        }

        user.setRole(input.getRole())
            .setUsername(input.getFullName())
            .setEmail(input.getEmail())
            .setPassword(passwordEncoder.encode(input.getPassword()));

        try {
            return userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException("Error saving user: " + e.getMessage(), e);
        }
    }

    private boolean isValidRole(String role) {
        return List.of("BORROWER", "LIBRARIAN").contains(role);
    }

    public UserEntity authenticate(LoginUserDto input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );
    
        UserEntity user = userRepository.findByEmail(input.getEmail())
                .orElseThrow();
    
        if (user.getRole() == null) {
            throw new IllegalArgumentException("Invalid role for the provided credentials");
        }

        // Validate the role
        if (!user.getRole().equals(input.getRole())) {
            throw new IllegalArgumentException("Invalid role for the provided credentials");
        }
    
        return user;
    }
}