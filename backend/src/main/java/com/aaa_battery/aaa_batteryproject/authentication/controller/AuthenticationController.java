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

        UserEntity authenticatedUser = authenticationService.authenticate(loginUserDto);

        String jwtToken = jwtService.generateToken(authenticatedUser);

        Cookie cookie = new Cookie("jwt", jwtToken);
        cookie.setHttpOnly(true);
        cookie.setMaxAge((int) jwtService.getExpirationTime());
        cookie.setPath("/");
        cookie.setSecure(true);

        response.addCookie(cookie);

        LoginResponse loginResponse = new LoginResponse()
                .setToken(jwtToken)
                .setExpiresIn(jwtService.getExpirationTime())
                .setMessage("Login successful");

        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        // Check if the "jwt" cookie exists
        Cookie[] cookies = request.getCookies();
        if (cookies == null || 
            java.util.Arrays.stream(cookies).noneMatch(cookie -> "jwt".equals(cookie.getName()))) {
            // Return an error response with a message if no "jwt" cookie is found
            return ResponseEntity.status(401).body("No user logged in");
        }

        // Create a cookie with the same name but expired
        Cookie cookie = new Cookie("jwt", "");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0); // Expire immediately
        cookie.setPath("/");
        cookie.setSecure(true);

        response.addCookie(cookie);

        return ResponseEntity.ok("User logged out successfully");
    }
}