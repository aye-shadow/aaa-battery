package com.aaa_battery.aaa_batteryproject.user.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.aaa_battery.aaa_batteryproject.user.dtos.UserDTO;
import com.aaa_battery.aaa_batteryproject.user.model.UserEntity;
import com.aaa_battery.aaa_batteryproject.user.services.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> authenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        UserEntity currentUser = (UserEntity) authentication.getPrincipal();
        UserDTO userDTO = userService.convertToDTO(currentUser);

        return ResponseEntity.ok(userDTO);
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestParam String oldPassword, @RequestParam String newPassword) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserEntity currentUser = (UserEntity) authentication.getPrincipal();

        if (!passwordEncoder.matches(oldPassword, currentUser.getPassword())) {
            return ResponseEntity.badRequest().body("Old password is incorrect");
        }

        userService.updatePassword(currentUser.getId().longValue(), passwordEncoder.encode(newPassword));
        return ResponseEntity.ok("Password changed successfully");
    }
}