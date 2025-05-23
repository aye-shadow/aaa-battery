package com.aaa_battery.aaa_batteryproject.fines.repository;

import com.aaa_battery.aaa_batteryproject.fines.model.FineEntity;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FineRepository extends JpaRepository<FineEntity, Integer> {
    FineEntity findByBorrow_Id(Integer borrowId);
    List<FineEntity> findByBorrowerId(Integer borrowerId);
}