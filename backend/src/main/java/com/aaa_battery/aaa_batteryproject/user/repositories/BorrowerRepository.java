package com.aaa_battery.aaa_batteryproject.user.repositories;

import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BorrowerRepository extends JpaRepository<BorrowerEntity, Long> {
    // add methods here
    Optional<BorrowerEntity> findByEmail(String email);
}