package com.aaa_battery.aaa_batteryproject.user.services;

import com.aaa_battery.aaa_batteryproject.user.dtos.UserDTO;
import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;
import com.aaa_battery.aaa_batteryproject.user.model.UserEntity;
import com.aaa_battery.aaa_batteryproject.user.repositories.UserRepository;

import io.micrometer.core.ipc.http.HttpSender.Request;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserEntity> allUsers() {
        List<UserEntity> users = new ArrayList<>();

        userRepository.findAll().forEach(users::add);

        return users;
    }

    public void updatePassword(Long userId, String encodedPassword) {
        UserEntity user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(encodedPassword);
        userRepository.save(user);
    }

    public UserDTO convertToDTO(UserEntity user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setFullName(user.getFullName());
        userDTO.setEmail(user.getEmail());

        return userDTO;
    }

    public static UserDTO converToDTO(BorrowerEntity borrower) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(borrower.getId());
        userDTO.setFullName(borrower.getFullName());
        userDTO.setEmail(borrower.getEmail());

        return userDTO;
    }
}