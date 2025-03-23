package com.aaa_battery.aaa_batteryproject.requests.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

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

    private String itemType;
    private String itemName;
    private String itemBy;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    @CreationTimestamp
    @Column(updatable = false, name = "request_date")
    private LocalDateTime requestDate;

    private String notes;

    public enum RequestStatus {
        PENDING,
        APPROVED,
        REJECTED,
        CANCELLED
    }

    public RequestEntity() {
        this.status = RequestStatus.PENDING;
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

    public String getItemType() {
        return itemType;
    }

    public void setItemType(String itemType) {
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
}