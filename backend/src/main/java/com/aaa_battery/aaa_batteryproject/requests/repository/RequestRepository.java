package com.aaa_battery.aaa_batteryproject.requests.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aaa_battery.aaa_batteryproject.requests.model.RequestEntity;

public interface RequestRepository extends JpaRepository<RequestEntity, Long> {
}
