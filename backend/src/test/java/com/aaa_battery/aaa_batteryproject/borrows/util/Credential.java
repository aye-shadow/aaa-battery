package com.aaa_battery.aaa_batteryproject.authentication.util;

public enum Credential {
    BORROWER("testuser@example.com", "securepassword"),
    LIBRARIAN("i220899@nu.edu.pk", "newsecurepassword");

    private final String email;
    private final String password;
    private final String fullName;

    Credential(String email, String password) {
        this(email, password, "");
    }

    Credential(String email, String password, String fullName) {
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
}