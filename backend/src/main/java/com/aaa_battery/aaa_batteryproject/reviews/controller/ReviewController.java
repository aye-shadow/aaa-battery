package com.aaa_battery.aaa_batteryproject.reviews.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aaa_battery.aaa_batteryproject.reviews.dto.ReviewRequestDTO;
import com.aaa_battery.aaa_batteryproject.reviews.dto.ReviewResponseDTO;
import com.aaa_battery.aaa_batteryproject.reviews.service.ReviewService;
import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;
import com.aaa_battery.aaa_batteryproject.user.services.UserService;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    
    @Autowired
    private ReviewService reviewService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/borrower/new-review")
    public ResponseEntity<?> createReview(@RequestBody ReviewRequestDTO reviewDTO) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            BorrowerEntity borrower = (BorrowerEntity) userService.loadUserByUsername(auth.getName());
            
            // Check if borrowId is null
            if (reviewDTO.getBorrowId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Borrow ID cannot be null");
            }
            
            // Check for duplicate review
            if (reviewService.hasReviewedItem(borrower.getId(), reviewDTO.getItemId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You have already reviewed this item");
            }
            
            ReviewResponseDTO createdReview = reviewService.createReview(borrower, reviewDTO);
            return new ResponseEntity<>(createdReview, HttpStatus.CREATED);
            
        } catch (IllegalArgumentException e) {
            // Handle business logic validation exceptions with a 400 response
            if (e.getMessage().contains("already reviewed")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(e.getMessage());
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to create review: " + e.getMessage());
        }
    }

    @GetMapping("/borrower/my-reviews")
    public ResponseEntity<List<ReviewResponseDTO>> getMyReviews() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        BorrowerEntity borrower = (BorrowerEntity) userService.loadUserByUsername(auth.getName());
        
        List<ReviewResponseDTO> reviews = reviewService.getReviewsByBorrower(borrower);
        return ResponseEntity.ok(reviews);
    }
    
    /**
     * Update an existing review
     */
    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewResponseDTO> updateReview(
            @PathVariable Long reviewId,
            @RequestBody ReviewRequestDTO reviewDTO) {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        BorrowerEntity borrower = (BorrowerEntity) userService.loadUserByUsername(auth.getName());
        
        ReviewResponseDTO updatedReview = reviewService.updateReview(borrower, reviewId, reviewDTO);
        return ResponseEntity.ok(updatedReview);
    }
    
    /**
     * Get reviews for a specific item
     */
    @GetMapping("/item/{itemDescriptionId}")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsForItem(@PathVariable Integer itemDescriptionId) {
        List<ReviewResponseDTO> reviews = reviewService.getReviewsForItem(itemDescriptionId);
        return ResponseEntity.ok(reviews);
    }
    
    /**
     * Delete a review
     */
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        BorrowerEntity borrower = (BorrowerEntity) userService.loadUserByUsername(auth.getName());
        
        reviewService.deleteReview(borrower, reviewId);
        return ResponseEntity.noContent().build();
    }
}