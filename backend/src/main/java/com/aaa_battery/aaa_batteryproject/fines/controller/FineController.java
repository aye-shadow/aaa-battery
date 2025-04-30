package com.aaa_battery.aaa_batteryproject.fines.controller;

import com.aaa_battery.aaa_batteryproject.fines.dto.FineInfoDTO;
import com.aaa_battery.aaa_batteryproject.fines.model.FineEntity;
import com.aaa_battery.aaa_batteryproject.fines.repository.FineRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/fines")
public class FineController {

    private final FineRepository fineRepository;

    public FineController(FineRepository fineRepository) {
        this.fineRepository = fineRepository;
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
}