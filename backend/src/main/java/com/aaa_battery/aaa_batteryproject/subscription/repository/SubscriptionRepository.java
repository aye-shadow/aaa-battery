package com.aaa_battery.aaa_batteryproject.subscription.repository;

import com.aaa_battery.aaa_batteryproject.subscription.model.SubscriptionEntity;

import org.springframework.data.jpa.repository.JpaRepository;


public interface SubscriptionRepository extends JpaRepository<SubscriptionEntity, Long> {
    
}