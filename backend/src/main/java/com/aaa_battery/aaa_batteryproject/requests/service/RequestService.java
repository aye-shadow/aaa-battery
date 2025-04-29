package com.aaa_battery.aaa_batteryproject.requests.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.aaa_battery.aaa_batteryproject.requests.dto.RequestDTO;
import com.aaa_battery.aaa_batteryproject.requests.model.RequestEntity;
import com.aaa_battery.aaa_batteryproject.requests.repository.RequestRepository;
import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;
import com.aaa_battery.aaa_batteryproject.item.service.ItemService;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.ItemDescriptionEntity;

@Service
public class RequestService {

    private static final Logger logger = LoggerFactory.getLogger(RequestService.class);

    private final RequestRepository requestRepository;
    private final ItemService itemService;

    public RequestService(RequestRepository requestRepository, ItemService itemService) {
        this.requestRepository = requestRepository;
        this.itemService = itemService;
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

    public List<RequestEntity> findByRequestor(BorrowerEntity requestor) {
        if (requestor == null) {
            logger.error("Requestor cannot be null.");
            throw new IllegalArgumentException("Requestor cannot be null.");
        }
        logger.info("Fetching requests for requestor with ID: {}", requestor.getId());
        return requestRepository.findByRequestor(requestor);
    }

    public void updateRequestStatus(Long requestId, RequestEntity.RequestStatus status, String reason) {
        // firstly verify if the request status is valid
        if (status == null) {
            throw new IllegalArgumentException("Invalid request status.");
        }
        if (!java.util.Arrays.asList(RequestEntity.RequestStatus.values()).contains(status)) {
            throw new IllegalArgumentException("Invalid request status.");
        }

        RequestEntity requestEntity = requestRepository.findById(requestId)
                .orElseThrow(() -> {
                    throw new RuntimeException("Request not found");
                });

        // Ensure the method exits after throwing the exception
        if (requestEntity == null) {
            return;
        }

        requestEntity.setStatus(status);
        requestEntity.setReason(reason);
        requestRepository.save(requestEntity);
                
        // if new request status = APPROVED, add item to the inventory
        if (status == RequestEntity.RequestStatus.APPROVED) {
            // Create a description map for the item
            Map<String, Object> descriptionData = Map.of(
                "itemName", requestEntity.getItemName(),
                "type", requestEntity.getItemType(),
                "totalCopies", 1 // Default to 1 copy
            );

            // Add the item using ItemService
            ItemDescriptionEntity description = itemService.addItemFromRequest(descriptionData);
            if (description == null) {
                throw new RuntimeException("Failed to add item to inventory.");
            }
        }
    }    
}
