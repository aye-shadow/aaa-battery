package com.aaa_battery.aaa_batteryproject.requests.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;
import com.aaa_battery.aaa_batteryproject.user.services.BorrowerService;
import com.aaa_battery.aaa_batteryproject.requests.dto.RequestDTO;
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

    @GetMapping("/borrower/my-requests")
    public ResponseEntity<List<RequestEntity>> viewMyRequests() {
        try {
            // Get the currently authenticated borrower
            BorrowerEntity borrower = borrowerService.getAuthenticatedBorrower();
            
            // Need to add a method in RequestService to find requests by requestor
            List<RequestEntity> requests = requestService.findByRequestor(borrower);
            
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/librarian/view-requests")
    public ResponseEntity<List<RequestEntity>> viewRequests() {
        try {
            // Fetch all requests using the RequestService
            List<RequestEntity> requests = requestService.getAllRequests();

            // Return the list of requests in the response
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            // Handle any exceptions and return an error response
            return ResponseEntity.status(500).body(null);
        }
    }
}
