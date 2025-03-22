package com.aaa_battery.aaa_batteryproject.user.dtos;

import com.aaa_battery.aaa_batteryproject.user.roles.Role;

public class RegisterUserDto {
    private Role role;

    private String email;
    
    private String password;
    
    private String fullName;
    
    public RegisterUserDto() {
    }

    public RegisterUserDto(Role role, String email, String password, String fullName) {
        this.role = role;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
    }

    public Role getRole() {
        return role;
    }

    public RegisterUserDto setRole(Role role) {
        this.role = role;
        return this;
    }
    
    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getFullName() {
        return fullName;
    }

    public RegisterUserDto setEmail(String email) {
        this.email = email;
        return this;
    }

    public RegisterUserDto setPassword(String password) {
        this.password = password;
        return this;
    }

    public RegisterUserDto setFullName(String fullName) {
        this.fullName = fullName;
        return this;
    }
}
