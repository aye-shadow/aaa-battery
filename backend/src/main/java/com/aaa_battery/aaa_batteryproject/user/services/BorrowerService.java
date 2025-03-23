package com.aaa_battery.aaa_batteryproject.user.services;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;
import com.aaa_battery.aaa_batteryproject.user.repositories.UserRepository;

@Service
public class BorrowerService {

    private final UserRepository userRepository;

    public BorrowerService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public BorrowerEntity getAuthenticatedBorrower() {
    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof UserDetails) {
            String email = ((UserDetails) principal).getUsername();
            
            // Fetch the BorrowerEntity from the database using the username
            return userRepository.findByEmail(email)
                    .filter(user -> user instanceof BorrowerEntity)
                    .map(user -> (BorrowerEntity) user)
                    .orElseThrow(() -> new IllegalStateException("Authenticated user is not a borrower"));
        } else {
            throw new IllegalStateException("No authenticated user found");
        }
    }
    
}
