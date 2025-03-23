package com.aaa_battery.aaa_batteryproject.subscription.dtos;

public class SubscriptionRequestDTO {

    private Long userId;
    
    private String subscriptionType;
    
    private String paymentMethod;
    
    // Add other fields as needed
    
    // Getters and Setters
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getSubscriptionType() {
        return subscriptionType;
    }
    
    public void setSubscriptionType(String subscriptionType) {
        this.subscriptionType = subscriptionType;
    }
    
    public String getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}