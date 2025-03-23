package com.aaa_battery.aaa_batteryproject.borrows.model;

import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;
import com.aaa_battery.aaa_batteryproject.item.model.ItemEntity;
import jakarta.persistence.*;
import java.time.ZonedDateTime;

@Entity
@Table(name = "borrows")
public class BorrowEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @ManyToOne
    private BorrowerEntity borrower;

    @ManyToOne
    private ItemEntity item;
    
    private ZonedDateTime requestDate; // remove

    private ZonedDateTime borrowDate;

    private ZonedDateTime returnDate;

    private String status; // remove

    private String notes; // remove

    public BorrowEntity() {
    }

    // Getter for id
    public Integer getId() {
        return id;
    }

    // Setter for id
    public void setId(Integer id) {
        this.id = id;
    }

    // Getter for borrower
    public BorrowerEntity getBorrower() {
        return borrower;
    }

    // Setter for borrower
    public void setBorrower(BorrowerEntity borrower) {
        this.borrower = borrower;
    }

    // Getter for item
    public ItemEntity getItem() {
        return item;
    }

    // Setter for item
    public void setItem(ItemEntity item) {
        this.item = item;
    }

    // Getter for requestDate
    public ZonedDateTime getRequestDate() {
        return requestDate;
    }

    // Setter for requestDate
    public void setRequestDate(ZonedDateTime requestDate) {
        this.requestDate = requestDate;
    }

    // Getter for borrowDate
    public ZonedDateTime getBorrowDate() {
        return borrowDate;
    }

    // Setter for borrowDate
    public void setBorrowDate(ZonedDateTime borrowDate) {
        this.borrowDate = borrowDate;
    }

    // Getter for returnDate
    public ZonedDateTime getReturnDate() {
        return returnDate;
    }

    // Setter for returnDate
    public void setReturnDate(ZonedDateTime returnDate) {
        this.returnDate = returnDate;
    }

    // Getter for status
    public String getStatus() {
        return status;
    }

    // Setter for status
    public void setStatus(String status) {
        this.status = status;
    }

    // Getter for notes
    public String getNotes() {
        return notes;
    }

    // Setter for notes
    public void setNotes(String notes) {
        this.notes = notes;
    }
}