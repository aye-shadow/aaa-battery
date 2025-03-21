package com.aaa_battery.aaa_batteryproject.jwt.dtos;

public class RegisterUserDto {
    private String email;
    
    private String password;
    
    private String fullName;
    
    public RegisterUserDto() {
    }

    public RegisterUserDto(String email, String password, String fullName) {
        this.email = email;
        this.password = password;
        this.fullName = fullName;
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
