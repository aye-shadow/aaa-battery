package com.aaa_battery.aaa_batteryproject.borrows.model;

import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.aaa_battery.aaa_batteryproject.item.model.ItemEntity;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "borrows")
public class BorrowEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @ManyToOne
    @JsonIgnore
    private BorrowerEntity borrower;

    @ManyToOne
    private ItemEntity item;
    
    private Date borrowDate;
    private Date returnDate;

    public enum BorrowStatus {
        BORROWED,
        RETURNED
    }

    private BorrowStatus status;

    public BorrowEntity() {
        this.status = BorrowStatus.BORROWED; // Default status when a borrow request is created
        this.borrowDate = new Date(); // Set current date as borrow date
        this.returnDate = new Date(borrowDate.getTime() + (14 * 24 * 60 * 60 * 1000)); // Set return date to 14 days later
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

    // Getter for borrowDate
    public Date getBorrowDate() {
        return borrowDate;
    }

    // Setter for borrowDate
    public void setBorrowDate(Date borrowDate) {
        this.borrowDate = borrowDate;
    }

    // Getter for returnDate
    public Date getReturnDate() {
        return returnDate;
    }

    // Setter for returnDate
    public void setReturnDate(Date returnDate) {
        this.returnDate = returnDate;
    }

    public BorrowStatus getStatus() {
        return status;
    }

    public void setStatus(BorrowStatus status) {
        this.status = status;
    }
}