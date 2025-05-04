package com.aaa_battery.aaa_batteryproject.requests.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;
import com.aaa_battery.aaa_batteryproject.user.services.BorrowerService;
import com.aaa_battery.aaa_batteryproject.requests.dto.RequestDTO;
import com.aaa_battery.aaa_batteryproject.requests.dto.RequestResponseDTO;
import com.aaa_battery.aaa_batteryproject.requests.dto.RequestorDTO;
import com.aaa_battery.aaa_batteryproject.requests.dto.HandleRequestDTO;
import com.aaa_battery.aaa_batteryproject.requests.model.RequestEntity;
import com.aaa_battery.aaa_batteryproject.requests.service.RequestService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/request")
public class RequestController {

    private static final Logger logger = LoggerFactory.getLogger(RequestController.class);

    private final BorrowerService borrowerService;
    private final RequestService requestService;

    public RequestController(BorrowerService borrowerService, RequestService requestService) {
        this.borrowerService = borrowerService;
        this.requestService = requestService;
    }

    @PostMapping("/borrower/new-request")
    public ResponseEntity<String> submitNewRequest(@RequestBody RequestDTO requestDTO) {
        try {
            // Retrieve the currently authenticated borrower
            BorrowerEntity borrower = borrowerService.getAuthenticatedBorrower();
            
            // Check if borrower is null - return error if it is
            if (borrower == null) {
                return ResponseEntity.status(500).body("Failed to submit the request");
            }
    
            // Save the requestEntity
            requestService.saveRequest(requestDTO, borrower);
    
            // Return a success message
            return ResponseEntity.ok("Request submitted successfully");
        } catch (Exception e) {
            // Return a failure message in case of an error
            return ResponseEntity.status(500).body("Failed to submit the request");
        }
    }

    // In RequestController.java
    @GetMapping("/borrower/my-requests")
    public ResponseEntity<?> viewMyRequests() {
        try {
            BorrowerEntity borrower = borrowerService.getAuthenticatedBorrower();
            if (borrower == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            List<RequestEntity> requests = requestService.findByRequestor(borrower);
            return ResponseEntity.ok(requests);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            // Include the error message in the response to match the test expectation
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching requests: " + e.getMessage());
        }
    }

    @GetMapping("/librarian/view-requests")
    public ResponseEntity<List<RequestResponseDTO>> viewRequests() {
        try {
            // Fetch all requests using the RequestService
            List<RequestEntity> requests = requestService.getAllRequests();

            // Map RequestEntity to RequestResponseDTO
            List<RequestResponseDTO> responseDTOs = requests.stream().map(request -> {
                RequestResponseDTO dto = new RequestResponseDTO();
                dto.setId(request.getId());
                dto.setItemType(request.getItemType());
                dto.setItemName(request.getItemName());
                dto.setItemBy(request.getItemBy());
                dto.setStatus(request.getStatus());
                dto.setRequestDate(request.getRequestDate());
                dto.setNotes(request.getNotes());
                dto.setReason(request.getReason());

                // Map BorrowerEntity to RequestorDTO
                BorrowerEntity requestor = request.getRequestor();
                if (requestor != null) {
                    RequestorDTO requestorDTO = new RequestorDTO();
                    requestorDTO.setId(requestor.getId());
                    requestorDTO.setFullName(requestor.getFullName());
                    requestorDTO.setEmail(requestor.getEmail());
                    dto.setRequestor(requestorDTO);
                }

                return dto;
            }).toList();

            // Return the list of DTOs in the response
            return ResponseEntity.ok(responseDTOs);
        } catch (Exception e) {
            // Handle any exceptions and return an error response
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/librarian/handle-request")
    public ResponseEntity<String> handleRequest(@RequestBody HandleRequestDTO handleRequestDTO) {
        try {
            Long id = handleRequestDTO.getId();
            String status = handleRequestDTO.getStatus();
            String reason = handleRequestDTO.getReason();

            // Log received status for debugging
            System.out.println("Received status: " + status);

            RequestEntity.RequestStatus requestStatus = RequestEntity.RequestStatus.valueOf(status.toUpperCase());
            requestService.updateRequestStatus(id, requestStatus, reason);
            return ResponseEntity.ok("Request status updated.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid request status. Valid values: " +
                java.util.Arrays.toString(RequestEntity.RequestStatus.values()));
        } catch (RuntimeException e) {
            if ("Request not found".equals(e.getMessage())) {
                return ResponseEntity.status(500).body("Request not found.");
            }
            return ResponseEntity.status(500).body("Failed to update the request status: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to update the request status: " + e.getMessage());
        }
    }
}
