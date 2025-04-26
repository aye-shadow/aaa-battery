package com.aaa_battery.aaa_batteryproject.user.dtos;

import com.aaa_battery.aaa_batteryproject.user.roles.Role;

public class LoginUserDto {
    private String email;
    
    private String password;

    private Role role;

    public LoginUserDto() {
    }

    public LoginUserDto(String email, String password) {
        this.email = email;
        this.password = password;
    }
    
    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public LoginUserDto setEmail(String email) {
        this.email = email;
        return this;
    }

    public LoginUserDto setPassword(String password) {
        this.password = password;
        return this;
    }

    public Role getRole() {
        return role;
    }

    public LoginUserDto setRole(Role role) {
        this.role = role;
        return this;
    }
}