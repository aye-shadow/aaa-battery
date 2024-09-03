package com.lanyard.lanyard_sda_project.testclass.repository;

import com.lanyard.lanyard_sda_project.testclass.model.TestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestRepository extends JpaRepository<TestEntity, Long> {
}