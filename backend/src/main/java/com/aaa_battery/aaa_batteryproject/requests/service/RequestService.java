package com.aaa_battery.aaa_batteryproject.requests.service;

import java.util.List;

import org.springframework.stereotype.Service;
import com.aaa_battery.aaa_batteryproject.requests.dto.RequestDTO;
import com.aaa_battery.aaa_batteryproject.requests.model.RequestEntity;
import com.aaa_battery.aaa_batteryproject.requests.repository.RequestRepository;
import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;

@Service
public class RequestService {

    private final RequestRepository requestRepository;

    public RequestService(RequestRepository requestRepository) {
        this.requestRepository = requestRepository;
        
    }

    public RequestEntity convertToEntity(RequestDTO requestDTO, BorrowerEntity borrower) {
        RequestEntity requestEntity = new RequestEntity();
        requestEntity.setItemType(requestDTO.getItemType());
        requestEntity.setItemName(requestDTO.getItemName());
        requestEntity.setItemBy(requestDTO.getItemBy());
        requestEntity.setNotes(requestDTO.getNotes());
        requestEntity.setRequestor(borrower);
        return requestEntity;
    }

    public RequestEntity saveRequest(RequestDTO requestDTO, BorrowerEntity borrower) {
        // Create a new RequestEntity and map fields from RequestDTO
        RequestEntity requestEntity = convertToEntity(requestDTO, borrower);
    
        return requestRepository.save(requestEntity);
    }

    public List<RequestEntity> getAllRequests() {
        return requestRepository.findAll();
    }
}
    