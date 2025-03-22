package com.aaa_battery.aaa_batteryproject.user.model;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "librarians")
@PrimaryKeyJoinColumn(name = "id") // Links to the 'id' column in the 'users' table
public class LibrarianEntity extends UserEntity {

    public LibrarianEntity()
    {

    }

    public LibrarianEntity(String fullName, String email, String password) {
        super(fullName, email, password);
    }

    void add_item()
    {

    }

    void remove_item() {
    }

    void update_item() {
    }

    void observe_borrow_logs() {
    }

    void observe_fine_logs() {
    }
}