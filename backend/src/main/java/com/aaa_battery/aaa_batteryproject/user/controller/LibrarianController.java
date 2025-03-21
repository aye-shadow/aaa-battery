package com.aaa_battery.aaa_batteryproject.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.aaa_battery.aaa_batteryproject.user.model.UserEntity;
import com.aaa_battery.aaa_batteryproject.user.services.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/librarian")
public class LibrarianController {

    @Autowired
    private UserService userService;

    public LibrarianController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/all_users")
    public ResponseEntity<List<UserEntity>> allUsers() {
        List <UserEntity> users = userService.allUsers();

        return ResponseEntity.ok(users);
    }

    @PostMapping("/add_user")
    public ResponseEntity<UserEntity> addUser(@RequestBody UserEntity user) {
       // do nothign, this is an example endpoint
        return ResponseEntity.ok(user);
    }
}