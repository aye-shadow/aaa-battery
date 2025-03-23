package com.aaa_battery.aaa_batteryproject.requests.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aaa_battery.aaa_batteryproject.requests.model.RequestEntity;
import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;

public interface RequestRepository extends JpaRepository<RequestEntity, Long> {
    List<RequestEntity> findByRequestor(BorrowerEntity requestor);
}
