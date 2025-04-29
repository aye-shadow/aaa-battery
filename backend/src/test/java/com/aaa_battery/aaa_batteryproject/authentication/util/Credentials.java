package com.aaa_battery.aaa_batteryproject.authentication.util;

public enum Credentials {
    BORROWER("testuser@example.com", "securepassword"),
    LIBRARIAN("i220899@nu.edu.pk", "newsecurepassword"),
    INVALID("invalid@example.com", "invalidpassword"),
    BORROWER_INCORRECT("testuser@example.com", "incorrectpassword"),
    LIBRARIAN_INCORRECT("i220899@nu.edu.pk", "incorrectpassword"),
    NEW_LIBRARIAN("new.libarian@example.com", "newpassword123", "New Librarian"),
    NEW_BORROWER("new.borrower@example.com", "newpassword123", "New Borrower");

    private final String email;
    private final String password;
    private final String fullName;

    Credentials(String email, String password) {
        this(email, password, "");
    }

    Credentials(String email, String password, String fullName) {
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