package com.aaa_battery.aaa_batteryproject.requests.dto;

import java.time.LocalDateTime;

import com.aaa_battery.aaa_batteryproject.item.model.ItemType;
import com.aaa_battery.aaa_batteryproject.requests.model.RequestEntity.RequestStatus;

public class RequestResponseDTO {
    private Integer id;
    private ItemType itemType;
    private String itemName;
    private String itemBy;
    private RequestStatus status;
    private LocalDateTime requestDate;
    private String notes;
    private RequestorDTO requestor;
    private String reason;

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public ItemType getItemType() {
        return itemType;
    }

    public void setItemType(ItemType itemType) {
        this.itemType = itemType;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getItemBy() {
        return itemBy;
    }

    public void setItemBy(String itemBy) {
        this.itemBy = itemBy;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public LocalDateTime getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDateTime requestDate) {
        this.requestDate = requestDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public RequestorDTO getRequestor() {
        return requestor;
    }

    public void setRequestor(RequestorDTO requestor) {
        this.requestor = requestor;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }
}