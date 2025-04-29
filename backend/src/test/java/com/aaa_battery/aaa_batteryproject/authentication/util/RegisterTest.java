package com.aaa_battery.aaa_batteryproject.authentication.util;

import org.springframework.test.web.servlet.MockMvc;

import com.aaa_battery.aaa_batteryproject.authentication.service.AuthenticationService;
import com.aaa_battery.aaa_batteryproject.security.jwt.services.JwtService;
import com.aaa_battery.aaa_batteryproject.user.model.UserEntity;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.aaa_battery.aaa_batteryproject.user.dtos.RegisterUserDto;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

import org.mockito.Mockito;

public class RegisterTest {
    public static void registerUser(AuthenticationService authenticationService, MockMvc mockMvc, UserEntity registeredUser) throws Exception {
        RegisterUserDto newLibrarian = new RegisterUserDto()
            .setEmail(registeredUser.getEmail())
            .setPassword(registeredUser.getPassword())
            .setRole(registeredUser.getRole())
            .setFullName(registeredUser.getFullName());

        Mockito.when(authenticationService.signup(any(RegisterUserDto.class)))
            .thenReturn(registeredUser);

        mockMvc.perform(post("/api/auth/signup")
                .contentType("application/json")
                .content(new ObjectMapper().writeValueAsString(newLibrarian)))
            .andExpect(status().isOk())
            .andExpect(content().json(new ObjectMapper().writeValueAsString(registeredUser)));
    }

    public static void registerUserWrong(AuthenticationService authenticationService, MockMvc mockMvc, UserEntity registeredUser, String errorString) throws Exception {
        RegisterUserDto newUser = new RegisterUserDto()
            .setEmail(registeredUser.getEmail())
            .setPassword(registeredUser.getPassword())
            .setRole(registeredUser.getRole())
            .setFullName(registeredUser.getFullName());

        Mockito.when(authenticationService.signup(any(RegisterUserDto.class)))
            .thenThrow(new IllegalArgumentException(errorString));

        mockMvc.perform(post("/api/auth/signup")
                .contentType("application/json")
                .content(new ObjectMapper().writeValueAsString(registeredUser)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string(errorString));
    }

    public static void registerWithMissingRole(AuthenticationService authenticationService, MockMvc mockMvc, UserEntity newUser, String errorString) throws JsonProcessingException, Exception {
        RegisterUserDto registeredUser = new RegisterUserDto()
            .setEmail(newUser.getEmail())
            .setPassword(newUser.getPassword())
            .setFullName(newUser.getFullName());

        Mockito.when(authenticationService.signup(any(RegisterUserDto.class)))
            .thenThrow(new IllegalArgumentException(errorString));

        mockMvc.perform(post("/api/auth/signup")
                .contentType("application/json")
                .content(new ObjectMapper().writeValueAsString(registeredUser)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string(errorString));        
    }
}
