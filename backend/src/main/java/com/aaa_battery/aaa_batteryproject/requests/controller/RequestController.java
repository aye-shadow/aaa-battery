package com.aaa_battery.aaa_batteryproject.requests.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.aaa_battery.aaa_batteryproject.user.dtos.UserDTO;
import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;
import com.aaa_battery.aaa_batteryproject.user.services.BorrowerService;
import com.aaa_battery.aaa_batteryproject.requests.dto.RequestDTO;
import com.aaa_battery.aaa_batteryproject.requests.dto.RequestResponseDTO;
import com.aaa_battery.aaa_batteryproject.requests.model.RequestEntity;
import com.aaa_battery.aaa_batteryproject.requests.service.RequestService;

@RestController
@RequestMapping("/api/request")
public class RequestController {

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

            // Save the requestEntity
            requestService.saveRequest(requestDTO, borrower);

            // Return a success message
            return ResponseEntity.ok("Request submitted successfully");
        } catch (Exception e) {
            // Return a failure message in case of an error
            return ResponseEntity.status(500).body("Failed to submit the request");
        }
    }

    @GetMapping("/librarian/view-requests")
    public ResponseEntity<List<RequestResponseDTO>> viewRequests() {
        try {
            // Fetch all requests using the RequestService
            List<RequestEntity> requests = requestService.getAllRequests();

            // Convert RequestEntity to RequestResponseDTO
            List<RequestResponseDTO> responseDTOs = requestService.getAllRequests(requests);

            // Return the list of RequestResponseDTO in the response
            return ResponseEntity.ok(responseDTOs);
        } catch (Exception e) {
            // Handle any exceptions and return an error response
            return ResponseEntity.status(500).body(null);
        }
    }
}
