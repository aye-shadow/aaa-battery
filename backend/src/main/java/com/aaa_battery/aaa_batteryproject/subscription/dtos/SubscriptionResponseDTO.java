package com.aaa_battery.aaa_batteryproject.subscription.dtos;

public class SubscriptionResponseDTO {

    private boolean success;
    private String message;
    private Long subscriptionId;
    private String status;
    
    // Constructors
    public SubscriptionResponseDTO() {
    }
    
    public SubscriptionResponseDTO(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    public SubscriptionResponseDTO(boolean success, String message, Long subscriptionId, String status) {
        this.success = success;
        this.message = message;
        this.subscriptionId = subscriptionId;
        this.status = status;
    }
    
    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public Long getSubscriptionId() {
        return subscriptionId;
    }
    
    public void setSubscriptionId(Long subscriptionId) {
        this.subscriptionId = subscriptionId;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
}