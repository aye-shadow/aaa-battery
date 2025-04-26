package com.aaa_battery.aaa_batteryproject.borrows.service;

import com.aaa_battery.aaa_batteryproject.borrows.model.BorrowEntity;
import com.aaa_battery.aaa_batteryproject.borrows.repository.BorrowRepository;
import com.aaa_battery.aaa_batteryproject.item.model.ItemEntity;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@Service
public class BorrowService
{
    private final BorrowRepository borrowRepository;
    @Autowired
    public BorrowService(BorrowRepository borrowRepository) {
        this.borrowRepository = borrowRepository;
    }

    public void saveBorrowRequest(BorrowEntity borrow) {
        borrowRepository.save(borrow);
    }

    public Optional<BorrowEntity> findById(Long id) {
        return borrowRepository.findById(id); // Find borrow request by ID
    }

    public List<BorrowEntity> findByBorrowerId(Long borrowerId) {
        return borrowRepository.findByBorrowerId(borrowerId); // Get borrow records for a borrower
    }

    public void saveReturn(BorrowEntity borrow, ItemEntity item) {
        borrow.setItem(item); // Set the item for the borrow record
        borrowRepository.save(borrow); // Save the updated borrow record
    }


}

