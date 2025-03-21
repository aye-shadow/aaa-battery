package com.aaa_battery.aaa_batteryproject.testclass.repository;

import com.aaa_battery.aaa_batteryproject.testclass.model.TestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestRepository extends JpaRepository<TestEntity, Long> {
}