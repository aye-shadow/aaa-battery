package com.aaa_battery.aaa_batteryproject.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.aaa_battery.aaa_batteryproject.user.repository.LibrarianRepository;
import com.aaa_battery.aaa_batteryproject.user.repository.UserRepository;

@RestController
@RequestMapping("/api/user")
public class UserController {
    // @Autowired
    // private UserRepository userRepository;

    // @Autowired
    // private LibrarianRepository librarianRepository;

    @PostMapping("/register") 
    public void registerUser() {
        // Register a user
    }
}
