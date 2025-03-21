package com.aaa_battery.aaa_batteryproject.jwt.dtos;

public class LoginUserDto {
    private String email;
    
    private String password;

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
}