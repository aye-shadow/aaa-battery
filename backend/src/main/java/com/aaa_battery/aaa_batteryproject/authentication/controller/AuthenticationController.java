package com.aaa_battery.aaa_batteryproject.authentication.controller;

import com.aaa_battery.aaa_batteryproject.authentication.responses.LoginResponse;
import com.aaa_battery.aaa_batteryproject.authentication.service.AuthenticationService;
import com.aaa_battery.aaa_batteryproject.security.jwt.services.JwtService;
import com.aaa_battery.aaa_batteryproject.user.dtos.LoginUserDto;
import com.aaa_battery.aaa_batteryproject.user.dtos.RegisterUserDto;
import com.aaa_battery.aaa_batteryproject.user.model.UserEntity;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RequestMapping("/api/auth")
@RestController
public class AuthenticationController {
    private final JwtService jwtService;
    
    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signup")
    public ResponseEntity<UserEntity> register(@RequestBody RegisterUserDto registerUserDto) {
        UserEntity registeredUser = authenticationService.signup(registerUserDto);

        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(
            @RequestBody LoginUserDto loginUserDto, 
            HttpServletRequest request, 
            HttpServletResponse response) {
        try {
            // Check if the "jwt" cookie already exists
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("jwt".equals(cookie.getName())) {
                        // Return the existing JWT token and its expiration time
                        LoginResponse alreadyLoggedInResponse = new LoginResponse()
                                .setToken(cookie.getValue())
                                .setExpiresIn(jwtService.getExpirationTime()) // Assuming this retrieves the correct expiration time
                                .setMessage("User already logged in");
                        return ResponseEntity.ok(alreadyLoggedInResponse);
                    }
                }
            }

            // Authenticate the user
            UserEntity authenticatedUser = authenticationService.authenticate(loginUserDto);

            if (authenticatedUser == null) {
                return ResponseEntity.status(401).body(
                        new LoginResponse()
                                .setMessage("Invalid credentials. Authentication failed.")
                );
            }

            // Check if the user's role matches the expected role
            if (!authenticatedUser.getRole().equals(loginUserDto.getRole())) {
                return ResponseEntity.status(403).body(
                        new LoginResponse()
                                .setMessage("Invalid role for the provided credentials")
                );
            }

            // Generate JWT token
            String jwtToken = jwtService.generateToken(authenticatedUser);

            if (jwtToken == null || jwtToken.isEmpty()) {
                return ResponseEntity.status(500).body(
                        new LoginResponse()
                                .setMessage("Failed to generate JWT token")
                );
            }

            // Set the JWT token as a cookie
            Cookie cookie = new Cookie("jwt", jwtToken);
            cookie.setHttpOnly(true);
            cookie.setMaxAge((int) jwtService.getExpirationTime());
            cookie.setPath("/");
            cookie.setSecure(false);
            cookie.setAttribute("SameSite", "None");
            
            response.addCookie(cookie);

            // Return the login response
            LoginResponse loginResponse = new LoginResponse()
                    .setToken(jwtToken)
                    .setExpiresIn(jwtService.getExpirationTime())
                    .setMessage("Login successful");

            return ResponseEntity.ok(loginResponse);
        } catch (Exception e) {
            // Log the error (if logging is set up) and return a generic error message
            e.printStackTrace(); // Replace with proper logging in production
            return ResponseEntity.status(500).body(
                    new LoginResponse()
                            .setMessage("An unexpected error occurred during login")
            );
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return ResponseEntity.status(401).body("No cookies found in the request; no user logged in");
        }

        boolean jwtCookieFound = java.util.Arrays.stream(cookies)
                .anyMatch(cookie -> "jwt".equals(cookie.getName()));
        if (!jwtCookieFound) {
            return ResponseEntity.status(401).body("JWT cookie not found in the request: no user logged in");
        }

        // Expire the cookie
        Cookie cookie = new Cookie("jwt", "");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        cookie.setSecure(false);
        cookie.setAttribute("SameSite", "None");

        response.addCookie(cookie);

        return ResponseEntity.ok("User logged out successfully");
    }
}