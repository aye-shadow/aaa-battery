package com.aaa_battery.aaa_batteryproject.fines.model;

import java.util.Date;

import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;
import com.aaa_battery.aaa_batteryproject.borrows.model.BorrowEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "fines")
public class FineEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "borrower_id")
    private BorrowerEntity borrower;

    @OneToOne
    @JoinColumn(name = "borrow_id")
    private BorrowEntity borrow;

    private Double amount;
    private Date issuedDate;
    private Boolean paid;

    // Getters and setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public BorrowerEntity getBorrower() {
        return borrower;
    }

    public void setBorrower(BorrowerEntity borrower) {
        this.borrower = borrower;
    }

    public BorrowEntity getBorrow() {
        return borrow;
    }

    public void setBorrow(BorrowEntity borrow) {
        this.borrow = borrow;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Date getIssuedDate() {
        return issuedDate;
    }

    public void setIssuedDate(Date issuedDate) {
        this.issuedDate = issuedDate;
    }

    public Boolean getPaid() {
        return paid;
    }

    public void setPaid(Boolean paid) {
        this.paid = paid;
    }

    public void setFineimposedOn(BorrowerEntity borrowerEntity) {
        this.borrower = borrowerEntity;
    }
}