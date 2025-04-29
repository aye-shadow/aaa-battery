package com.aaa_battery.aaa_batteryproject.fines.dto;

public class FineInfoDTO {
    private Integer fineId;
    private String borrowerName;
    private String itemName;
    private Double amount;
    private Boolean paid;

    public FineInfoDTO(Integer fineId, String borrowerName, String itemName, Double amount, Boolean paid) {
        this.fineId = fineId;
        this.borrowerName = borrowerName;
        this.itemName = itemName;
        this.amount = amount;
        this.paid = paid;
    }

    // Getters and setters

    public Integer getFineId() { return fineId; }
    public void setFineId(Integer fineId) { this.fineId = fineId; }

    public String getBorrowerName() { return borrowerName; }
    public void setBorrowerName(String borrowerName) { this.borrowerName = borrowerName; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public Boolean getPaid() { return paid; }
    public void setPaid(Boolean paid) { this.paid = paid; }
}