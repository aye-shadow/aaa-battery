package com.aaa_battery.aaa_batteryproject.fines.dto;

import java.util.Date;

public class BorrowerFineDTO {
    private Integer fineId;
    private Double amount;
    private Boolean paid;
    private Date issuedDate;
    
    // Borrow details
    private Integer itemId;
    private String itemName;
    private Date borrowDate;
    private Date returnDate;
    private Long daysLate;
    
    // Getters and setters
    public Integer getFineId() {
        return fineId;
    }
    
    public void setFineId(Integer fineId) {
        this.fineId = fineId;
    }
    
    public Double getAmount() {
        return amount;
    }
    
    public void setAmount(Double amount) {
        this.amount = amount;
    }
    
    public Boolean getPaid() {
        return paid;
    }
    
    public void setPaid(Boolean paid) {
        this.paid = paid;
    }
    
    public Date getIssuedDate() {
        return issuedDate;
    }
    
    public void setIssuedDate(Date issuedDate) {
        this.issuedDate = issuedDate;
    }
    
    public Integer getItemId() {
        return itemId;
    }
    
    public void setItemId(Integer itemId) {
        this.itemId = itemId;
    }
    
    public String getItemName() {
        return itemName;
    }
    
    public void setItemName(String itemName) {
        this.itemName = itemName;
    }
    
    public Date getBorrowDate() {
        return borrowDate;
    }
    
    public void setBorrowDate(Date borrowDate) {
        this.borrowDate = borrowDate;
    }
    
    public Date getReturnDate() {
        return returnDate;
    }
    
    public void setReturnDate(Date returnDate) {
        this.returnDate = returnDate;
    }
    
    public Long getDaysLate() {
        return daysLate;
    }
    
    public void setDaysLate(Long daysLate) {
        this.daysLate = daysLate;
    }
}