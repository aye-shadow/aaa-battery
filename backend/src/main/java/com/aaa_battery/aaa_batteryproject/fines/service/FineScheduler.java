package com.aaa_battery.aaa_batteryproject.fines.service;

import com.aaa_battery.aaa_batteryproject.borrows.model.BorrowEntity;
import com.aaa_battery.aaa_batteryproject.borrows.repository.BorrowRepository;
import com.aaa_battery.aaa_batteryproject.fines.model.FineEntity;
import com.aaa_battery.aaa_batteryproject.fines.repository.FineRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class FineScheduler {

    private final BorrowRepository borrowRepository;
    private final FineRepository fineRepository;
    private static final double DAILY_FINE = 100.0; // Rs100 per day

    public FineScheduler(BorrowRepository borrowRepository, FineRepository fineRepository) {
        this.borrowRepository = borrowRepository;
        this.fineRepository = fineRepository;
    }

    // Runs every day at 1am
    @Scheduled(cron = "0 0 1 * * *")
    public void checkAndApplyFines() {
        List<BorrowEntity> borrows = borrowRepository.findAll();
        Date today = new Date();

        for (BorrowEntity borrow : borrows) {
            if (borrow.getReturnedOn() == null && borrow.getReturnDate() != null && today.after(borrow.getReturnDate())) {
                long overdueDays = (today.getTime() - borrow.getReturnDate().getTime()) / (1000 * 60 * 60 * 24);
                double fineAmount = overdueDays * DAILY_FINE;

                FineEntity fine = fineRepository.findByBorrow_Id(borrow.getId());
                if (fine == null) {
                    fine = new FineEntity();
                    fine.setBorrow(borrow);
                    fine.setBorrower(borrow.getBorrower());
                    fine.setIssuedDate(today);
                    fine.setPaid(false);
                }
                fine.setAmount(fineAmount);
                fineRepository.save(fine);
            }
        }
    }
}