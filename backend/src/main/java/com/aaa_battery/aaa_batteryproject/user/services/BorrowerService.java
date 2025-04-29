package com.aaa_battery.aaa_batteryproject.user.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aaa_battery.aaa_batteryproject.borrows.model.BorrowEntity;
import com.aaa_battery.aaa_batteryproject.borrows.repository.BorrowRepository;
import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;
import com.aaa_battery.aaa_batteryproject.user.repositories.BorrowerRepository;
import com.aaa_battery.aaa_batteryproject.user.repositories.UserRepository;

@Service
public class BorrowerService {

    private static final Logger logger = LoggerFactory.getLogger(BorrowerService.class);

    private final UserRepository userRepository;
    private final BorrowRepository borrowRepository;
    private final BorrowerRepository borrowerRepository;

    @Autowired
    public BorrowerService(UserRepository userRepository, BorrowRepository borrowRepository, BorrowerRepository borrowerRepository) {
        this.borrowerRepository = borrowerRepository;
        this.userRepository = userRepository;
        this.borrowRepository = borrowRepository;
    }

    public void saveBorrowRequest(BorrowEntity borrow) {
        borrowRepository.save(borrow);  }

    public BorrowerEntity findBorrowerById(Long id) {
        return borrowerRepository.findById(id).orElse(null);
    }

    public BorrowerEntity saveBorrower(BorrowerEntity borrower) {
        return borrowerRepository.save(borrower);
    }

    public BorrowerEntity getAuthenticatedBorrower() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof UserDetails) {
            String email = ((UserDetails) principal).getUsername();
            logger.info("Fetching borrower with email: {}", email);

            return userRepository.findByEmail(email)
                    .filter(user -> user instanceof BorrowerEntity)
                    .map(user -> (BorrowerEntity) user)
                    .orElseThrow(() -> {
                        logger.error("Authenticated user is not a borrower.");
                        return new IllegalStateException("Authenticated user is not a borrower");
                    });
        } else {
            logger.error("No authenticated user found.");
            throw new IllegalStateException("No authenticated user found");
        }
    }
}
