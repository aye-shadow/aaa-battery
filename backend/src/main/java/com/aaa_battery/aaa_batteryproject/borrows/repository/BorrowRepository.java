package com.aaa_battery.aaa_batteryproject.borrows.repository;


import com.aaa_battery.aaa_batteryproject.borrows.model.BorrowEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BorrowRepository extends JpaRepository<BorrowEntity, Long> {
    List<BorrowEntity> findByBorrowerId(Long borrowerId);
    Optional<BorrowEntity> findById(Long id);
    Optional<BorrowEntity> findById(Integer borrowId);
}


