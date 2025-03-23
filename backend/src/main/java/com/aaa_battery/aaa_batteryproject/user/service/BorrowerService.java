package com.aaa_battery.aaa_batteryproject.user.service;

import com.aaa_battery.aaa_batteryproject.borrows.model.BorrowEntity;
import com.aaa_battery.aaa_batteryproject.borrows.repository.BorrowRepository;
import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;
import com.aaa_battery.aaa_batteryproject.user.repositories.BorrowerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BorrowerService {

    private final BorrowerRepository borrowerRepository;
    private final BorrowRepository borrowRepository;
    @Autowired
    public BorrowerService(BorrowerRepository borrowerRepository, BorrowRepository borrowRepository) {
        this.borrowerRepository = borrowerRepository;
        this.borrowRepository = borrowRepository;   }

    public void saveBorrowRequest(BorrowEntity borrow) {
        borrowRepository.save(borrow);  }

    public BorrowerEntity findBorrowerById(Long id) {
        return borrowerRepository.findById(id).orElse(null);
    }

    public BorrowerEntity saveBorrower(BorrowerEntity borrower) {
        return borrowerRepository.save(borrower);
    }
}
