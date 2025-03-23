package com.aaa_battery.aaa_batteryproject.subscription.controller;

import com.aaa_battery.aaa_batteryproject.subscription.dtos.SubscriptionRequestDTO;
import com.aaa_battery.aaa_batteryproject.subscription.dtos.SubscriptionResponseDTO;
import com.aaa_battery.aaa_batteryproject.subscription.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/subscribe")
public class SubscriptionController {
    
    private final SubscriptionService subscriptionService;
    
    @Autowired
    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }
    
    /**
     * Endpoint for subscribing a user to AAA service
     * 
     * @param subscriptionRequest Contains user subscription details
     * @return Response with subscription confirmation
     */
    @PostMapping("/user/subscribe-to-aaa")
    public ResponseEntity<SubscriptionResponseDTO> subscribeUserToAAA(
            @RequestBody SubscriptionRequestDTO subscriptionRequest) {
        
        try {
            SubscriptionResponseDTO response = subscriptionService.createSubscription(subscriptionRequest);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            // Log exception here
            return new ResponseEntity<>(
                new SubscriptionResponseDTO(false, "Failed to create subscription: " + e.getMessage()),
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}