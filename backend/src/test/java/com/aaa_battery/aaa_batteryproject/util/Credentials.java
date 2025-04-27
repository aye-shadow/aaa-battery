package com.aaa_battery.aaa_batteryproject.util;

public enum Credentials {
    BORROWER("testuser@example.com", "securepassword"),
    LIBRARIAN("i220899@nu.edu.pk", "newsecurepassword"),
    INVALID("invalid@example.com", "invalidpassword"),
    BORROWER_INCORRECT("testuser@example.com", "incorrectpassword"),
    LIBRARIAN_INCORRECT("i220899@nu.edu.pk", "incorrectpassword");

    private final String email;
    private final String password;

    Credentials(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
}