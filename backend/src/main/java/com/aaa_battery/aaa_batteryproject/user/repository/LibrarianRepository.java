package com.aaa_battery.aaa_batteryproject.user.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.aaa_battery.aaa_batteryproject.user.model.LibrarianEntity;

@Repository
public interface LibrarianRepository extends JpaRepository<LibrarianEntity, Long> {
        
}
