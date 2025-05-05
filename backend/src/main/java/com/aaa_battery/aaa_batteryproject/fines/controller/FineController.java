package com.aaa_battery.aaa_batteryproject.fines.controller;

import com.aaa_battery.aaa_batteryproject.fines.dto.FineInfoDTO;
import com.aaa_battery.aaa_batteryproject.fines.dto.BorrowerFineDTO;
import com.aaa_battery.aaa_batteryproject.fines.model.FineEntity;
import com.aaa_battery.aaa_batteryproject.fines.repository.FineRepository;
import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;
import com.aaa_battery.aaa_batteryproject.user.repositories.BorrowerRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Date;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/fines")
public class FineController {

    private final FineRepository fineRepository;
    private final BorrowerRepository borrowerRepository;

    public FineController(FineRepository fineRepository, BorrowerRepository borrowerRepository) {
        this.fineRepository = fineRepository;
        this.borrowerRepository = borrowerRepository;
    }

    @GetMapping("/librarian/view-fines")
    public List<FineInfoDTO> getAllFines() {
        List<FineEntity> fines = fineRepository.findAll();
        return fines.stream().map(fine -> new FineInfoDTO(
                fine.getId(),
                fine.getBorrower() != null ? fine.getBorrower().getFullName() : "Unknown",
                fine.getBorrow() != null && fine.getBorrow().getItem() != null ? fine.getBorrow().getItem().getDescription().getItemName() : "Unknown",
                fine.getAmount(),
                fine.getPaid()
        )).collect(Collectors.toList());
    }
    
    @GetMapping("/borrower/my-fines")
    public ResponseEntity<List<BorrowerFineDTO>> getBorrowerFines() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); 
        String currentUserEmail = authentication.getName();
        
        BorrowerEntity borrower = borrowerRepository.findByEmail(currentUserEmail)
            .orElse(null);
            
        if (borrower == null) {
            return ResponseEntity.badRequest().build();
        }
        
        List<FineEntity> borrowerFines = fineRepository.findByBorrowerId(borrower.getId());
        
        List<BorrowerFineDTO> fineDTOs = borrowerFines.stream().map(fine -> {
            BorrowerFineDTO dto = new BorrowerFineDTO();
            dto.setFineId(fine.getId());
            dto.setAmount(fine.getAmount());
            dto.setPaid(fine.getPaid());
            dto.setIssuedDate(fine.getIssuedDate());
            
            if (fine.getBorrow() != null) {
                dto.setItemId(fine.getBorrow().getItem() != null ? fine.getBorrow().getItem().getItemId() : null);
                dto.setItemName(fine.getBorrow().getItem() != null ? fine.getBorrow().getItem().getDescription().getItemName() : "Unknown");
                dto.setBorrowDate(fine.getBorrow().getBorrowDate());
                dto.setReturnDate(fine.getBorrow().getReturnDate());
                
                // Calculate days passed since return date
                Date returnDate = fine.getBorrow().getReturnDate();
                Date currentDate = new Date();
                if (returnDate == null || returnDate.after(currentDate)) {
                    dto.setDaysLate(0L);
                } else {
                    long diffInMillies = currentDate.getTime() - returnDate.getTime();
                    long daysPassed = TimeUnit.DAYS.convert(diffInMillies, TimeUnit.MILLISECONDS);
                    dto.setDaysLate(daysPassed > 0 ? daysPassed : 0);
                }
            }
            
            return dto;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(fineDTOs);
    }
}