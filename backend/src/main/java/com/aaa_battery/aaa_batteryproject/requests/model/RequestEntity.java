package com.aaa_battery.aaa_batteryproject.requests.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.aaa_battery.aaa_batteryproject.item.model.ItemType;
import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "requests")
public class RequestEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "requestor_id", referencedColumnName = "id") // Foreign key column in RequestEntity
    private BorrowerEntity requestor;

    @Enumerated(EnumType.STRING)
    private ItemType itemType;
    
    private String itemName;
    private String itemBy;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    @CreationTimestamp
    @Column(updatable = false, name = "request_date")
    private LocalDateTime requestDate;

    private String notes;

    private String reason;

    public enum RequestStatus {
        SUBMITTED,
        PENDING,
        APPROVED,
        REJECTED,
        CANCELLED
    }

    public RequestEntity() {
        this.status = RequestStatus.SUBMITTED;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public BorrowerEntity getRequestor() {
        return requestor;
    }

    public void setRequestor(BorrowerEntity requestor) {
        this.requestor = requestor;
    }

    public ItemType getItemType() {
        return itemType;
    }

    public void setItemType(String itemType) {
        if (!ItemType.isValidType(itemType)) {
            throw new IllegalArgumentException("Invalid item type: " + itemType);
        }
        this.itemType = ItemType.valueOf(itemType.trim().toUpperCase());
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

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}