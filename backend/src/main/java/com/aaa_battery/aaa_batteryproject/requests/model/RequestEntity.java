package com.aaa_battery.aaa_batteryproject.requests.model;

import java.time.LocalDateTime;

import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "requests")
public class RequestEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    
    @ManyToOne
    private BorrowerEntity requestor;
    
    @Enumerated(EnumType.STRING)
    private RequestStatus status;
    
    private LocalDateTime requestDate;
    
    private String notes;
    
    public enum RequestStatus {
        PENDING,
        APPROVED,
        REJECTED,
        CANCELLED
    }
    
    public RequestEntity() {
        this.requestDate = LocalDateTime.now();
        this.status = RequestStatus.PENDING;
    }
    
    // Getters and Setters
    
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