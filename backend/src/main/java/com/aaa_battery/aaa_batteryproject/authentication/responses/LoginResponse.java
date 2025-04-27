package com.aaa_battery.aaa_batteryproject.authentication.responses;

import com.aaa_battery.aaa_batteryproject.user.roles.Role;

public class LoginResponse {
    private String token;
    private long expiresIn;
    private String message;
    private String email;    // New field
    private Role role;     // New field

    // Getters and setters
    public String getToken() {
        return token;
    }

    public LoginResponse setToken(String token) {
        this.token = token;
        return this;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public LoginResponse setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
        return this;
    }

    public String getMessage() {
        return message;
    }

    public LoginResponse setMessage(String message) {
        this.message = message;
        return this;
    }

    public String getEmail() {
        return email;
    }

    public LoginResponse setEmail(String email) {
        this.email = email;
        return this;
    }

    public Role getRole() {
        return role;
    }

    public LoginResponse setRole(Role role) {
        this.role = role;
        return this;
    }
}