package com.aaa_battery.aaa_batteryproject.util;

import org.springframework.test.web.servlet.MockMvc;

import com.aaa_battery.aaa_batteryproject.authentication.service.AuthenticationService;
import com.aaa_battery.aaa_batteryproject.security.jwt.services.JwtService;
import com.aaa_battery.aaa_batteryproject.user.model.UserEntity;
import com.aaa_battery.aaa_batteryproject.user.roles.Role;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.http.MediaType;
import org.springframework.mock.web.MockCookie;

public class LoginTest {
    public static void setUp(AuthenticationService authenticationService, JwtService jwtService, MockMvc mockMvc, String jwtString, String email, String password, Role role) {
        UserEntity user = new UserEntity();
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(role);

        when(authenticationService.authenticate(any())).thenReturn(user);
        when(jwtService.generateToken(any())).thenReturn(jwtString);
        when(jwtService.getExpirationTime()).thenReturn(3600L); 
    }

    public static void loginUser(AuthenticationService authenticationService, JwtService jwtService, MockMvc mockMvc, String jwtString, String email, String password, Role role) throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"" + email + "\",\"password\":\"" + password + "\",\"role\":\"" + role + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value(jwtString))
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(jsonPath("$.role").value(role.toString()));
    }

    public static void secondLogin(AuthenticationService authenticationService, JwtService jwtService, MockMvc mockMvc, String jwtString, String email, String password, Role role) throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"" + email + "\",\"password\":\"" + password + "\",\"role\":\"" + role + "\"}")
                .cookie(new MockCookie("jwt", jwtString)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.token").value(jwtString)) 
                .andExpect(jsonPath("$.expiresIn").value(3600))  
                .andExpect(jsonPath("$.message").value("User already logged in"))
                .andExpect(jsonPath("$.email").doesNotExist())   
                .andExpect(jsonPath("$.role").doesNotExist());
    }

    public static void performLoginIncorrectRole(AuthenticationService authenticationService, JwtService jwtService, MockMvc mockMvc, String jwtString, String email, String password, Role role) throws Exception {
        mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"email\":\"" + email + "\",\"password\":\"" + password + "\",\"role\":\"" + role + "\"}"))
            .andExpect(status().isForbidden())
            .andExpect(jsonPath("$.token").doesNotExist())
            .andExpect(jsonPath("$.message").value("Invalid credentials. Authentication failed."));
    }

    public static void performInvalidLogin(AuthenticationService authenticationService, MockMvc mockMvc, String email, String password, Role role) throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"" + email + "\",\"password\":\"" + password + "\",\"role\":\"" + role + "\"}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("An unexpected error occurred during login"));
    }

    public static void performLoginWithNoJwt(AuthenticationService authenticationService, JwtService jwtService, MockMvc mockMvc, String email, String password, Role role) throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"" + email + "\",\"password\":\"" + password + "\",\"role\":\"" + role + "\"}"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("Failed to generate JWT token"));
    }
}
