package com.aaa_battery.aaa_batteryproject.user.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;
import org.springframework.stereotype.Repository;

@Repository
public interface BorrowerRepository extends JpaRepository<BorrowerEntity, Long> {
    // Custom query methods (if needed) can be added here
}
