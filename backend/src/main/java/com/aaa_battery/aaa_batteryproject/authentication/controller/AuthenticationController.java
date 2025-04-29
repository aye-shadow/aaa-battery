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
    public ResponseEntity<?> register(@RequestBody RegisterUserDto registerUserDto) {
        try {
            UserEntity registeredUser = authenticationService.signup(registerUserDto);
            return ResponseEntity.ok(registeredUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (Exception e) {
            // Log the actual exception for debugging
            e.printStackTrace(); // In production, use a proper logger
            return ResponseEntity.status(500).body("An unexpected error occurred during signup: " + e.getMessage());
        }
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
                                .setExpiresIn(jwtService.getExpirationTime()) 
                                .setMessage("User already logged in");
                        return ResponseEntity.status(403).body(alreadyLoggedInResponse);
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

            // Commenting this out because the authenticate method already checks for the role
            // // Check if the user's role matches the expected role
            // if (!authenticatedUser.getRole().equals(loginUserDto.getRole())) {
            //     return ResponseEntity.status(403).body(
            //             new LoginResponse()
            //                     .setMessage("Invalid role for the provided credentials")
            //     );
            // }

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
            cookie.setSecure(true);
            cookie.setAttribute("SameSite", "None");
            
            response.addCookie(cookie);

            // Return the login response
            LoginResponse loginResponse = new LoginResponse()
            .setToken(jwtToken)
            .setExpiresIn(jwtService.getExpirationTime())
            .setMessage("Login successful")
            .setEmail(authenticatedUser.getEmail())
            .setRole(authenticatedUser.getRole());

            return ResponseEntity.ok(loginResponse);
        } catch (IllegalArgumentException e) {
            // Handle invalid role exception
            return ResponseEntity.status(403).body(
                    new LoginResponse()
                            .setMessage(e.getMessage())
            );
        } catch (Exception e) {
            // Handle other exceptions
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

        if (cookies == null || !jwtCookieFound) {
            return ResponseEntity.status(401).body("No user logged in");
        }

        // Expire the cookie
        Cookie cookie = new Cookie("jwt", "");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        cookie.setSecure(true);
        cookie.setAttribute("SameSite", "None");

        response.addCookie(cookie);

        return ResponseEntity.ok("User logged out successfully");
    }
}