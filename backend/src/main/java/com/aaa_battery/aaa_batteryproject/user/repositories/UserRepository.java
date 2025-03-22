package com.aaa_battery.aaa_batteryproject.user.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aaa_battery.aaa_batteryproject.user.model.UserEntity;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByEmail(String email);
}
