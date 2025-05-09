package com.aaa_battery.aaa_batteryproject.reviews.service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aaa_battery.aaa_batteryproject.borrows.model.BorrowEntity;
import com.aaa_battery.aaa_batteryproject.borrows.model.BorrowEntity.BorrowStatus;
import com.aaa_battery.aaa_batteryproject.borrows.repository.BorrowRepository;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.ItemDescriptionEntity;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.repository.ItemDescriptionRepository;
import com.aaa_battery.aaa_batteryproject.reviews.dto.ReviewCreateRequestDTO;
import com.aaa_battery.aaa_batteryproject.reviews.dto.ReviewResponseDTO;
import com.aaa_battery.aaa_batteryproject.reviews.dto.ReviewUpdateRequestDTO;
import com.aaa_battery.aaa_batteryproject.reviews.model.ReviewEntity;
import com.aaa_battery.aaa_batteryproject.reviews.repository.ReviewRepository;
import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private BorrowRepository borrowRepository;

    @Autowired
    private ItemDescriptionRepository itemDescriptionRepository;
    
    /**
     * Create a new review
     */
    @Transactional
    public ReviewResponseDTO createReview(BorrowerEntity borrower, ReviewCreateRequestDTO reviewDTO) {
        try {
            // Find the borrow entity first
            BorrowEntity borrow = borrowRepository.findById(reviewDTO.getBorrowId())
                    .orElseThrow(() -> new EntityNotFoundException("Borrow with ID " + reviewDTO.getBorrowId() + " not found"));
            
            // Validate that the borrow status is RETURNED
            if (borrow.getStatus() != BorrowStatus.RETURNED) {
                throw new IllegalArgumentException("You can only review items that have been returned");
            }
        
            // Get the correct itemDescriptionId from the borrow record
            Integer itemDescriptionId = borrow.getItem().getDescription().getDescriptionId();
            
            // Check for duplicate review using the correct itemDescriptionId
            if (hasReviewedItem(borrower.getId(), itemDescriptionId)) {
                throw new IllegalArgumentException("You have already reviewed this item");
            }
            
            // Validate that the borrower is the owner of the borrow record
            if (!borrow.getBorrower().equals(borrower)) {
                throw new IllegalArgumentException("You can only review items you have borrowed");
            }
            
            // Get the item description
            ItemDescriptionEntity itemDescription = borrow.getItem().getDescription();
            
            // Create the review entity with all required fields
            ReviewEntity review = new ReviewEntity();
            review.setReviewer(borrower);
            review.setItemDescription(itemDescription); // Set itemDescription before saving
            review.setBorrow(borrow);
            review.setComment(reviewDTO.getComment());
            review.setCreatedAt(new Date());
            // Set rating to null initially to avoid automatic recalculation
            review.setRating(null);
            
            // Save the review first time
            ReviewEntity savedReview = reviewRepository.save(review);
            
            // Now set the rating (this will trigger recalculation in the entity)
            savedReview.setRating(reviewDTO.getRating());
            
            // Save the review again
            savedReview = reviewRepository.save(savedReview);
            
            // Perform manual recalculation to ensure accuracy
            List<ReviewEntity> allReviews = reviewRepository.findByItemDescription(itemDescription);
            double sum = 0;
            int count = 0;
            
            for (ReviewEntity rev : allReviews) {
                if (rev.getRating() != null) {
                    sum += rev.getRating();
                    count++;
                }
            }
            
            double average = count > 0 ? sum / count : 0;
            System.out.println("Calculated new average rating: " + average + " (sum=" + sum + ", count=" + count + ")");
            
            // Update the average rating directly
            itemDescription.setAverageRating(average);
            
            // Save the item description explicitly
            itemDescriptionRepository.save(itemDescription);
            
            // Convert to DTO and return
            return convertToDTO(savedReview);
        } catch (Exception e) {
            // Add this for better debugging
            e.printStackTrace();
            throw e; // Re-throw to let the controller handle it
        }
    }
    
    /**
     * Update an existing review
     */
    @Transactional
    public ReviewResponseDTO updateReview(BorrowerEntity borrower, Long reviewId, ReviewUpdateRequestDTO reviewDTO) {
        // Find the review
        ReviewEntity review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new EntityNotFoundException("Review with ID " + reviewId + " not found"));
        
        // Validate that the reviewer is the owner of the review
        if (!review.getReviewer().equals(borrower)) {
            throw new IllegalArgumentException("You can only update your own reviews");
        }
        
        // Get the item description for recalculation later
        ItemDescriptionEntity itemDescription = review.getItemDescription();
        
        // Update the review details
        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());
        review.setUpdatedAt(new Date());
        
        // Save the updated review
        ReviewEntity updatedReview = reviewRepository.save(review);
        
        // Recalculate average rating
        List<ReviewEntity> allReviews = reviewRepository.findByItemDescription(itemDescription);
        double sum = 0;
        int count = 0;
        
        for (ReviewEntity rev : allReviews) {
            if (rev.getRating() != null) {
                sum += rev.getRating();
                count++;
            }
        }
        
        double average = count > 0 ? sum / count : 0;
        System.out.println("Updated average rating: " + average + " (sum=" + sum + ", count=" + count + ")");
        
        // Update the average rating directly
        itemDescription.setAverageRating(average);
        
        // Save the item description explicitly
        itemDescriptionRepository.save(itemDescription);
        
        // Convert to DTO and return
        return convertToDTO(updatedReview);
    }
    
    /**
     * Get reviews for an item description
     */
    public List<ReviewResponseDTO> getReviewsForItem(Integer itemDescriptionId) {
        // Find the item description
        ItemDescriptionEntity itemDescription = new ItemDescriptionEntity();
        itemDescription.setDescriptionId(itemDescriptionId);
        
        // Get reviews
        List<ReviewEntity> reviews = reviewRepository.findByItemDescription(itemDescription);
        
        // Convert to DTOs and return
        return reviews.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get reviews by a borrower
     */
    public List<ReviewResponseDTO> getReviewsByBorrower(BorrowerEntity borrower) {
        List<ReviewEntity> reviews = reviewRepository.findByReviewer(borrower);
        
        return reviews.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Delete a review
     */
    @Transactional
    public boolean deleteReview(BorrowerEntity borrower, Long reviewId) {
        try {
            // Find the review
            ReviewEntity review = reviewRepository.findById(reviewId)
                    .orElse(null);
            
            // Check if review exists
            if (review == null) {
                return false; // Review not found
            }
            
            // Validate that the reviewer is the owner of the review
            if (!review.getReviewer().equals(borrower)) {
                return false; // Not authorized to delete
            }
            
            // Delete the review
            reviewRepository.delete(review);
            return true; // Successfully deleted
        } catch (Exception e) {
            // Log the exception if needed
            return false; // Failed to delete due to some other error
        }
    }
    
    /**
     * Convert a review entity to a DTO
     */
    private ReviewResponseDTO convertToDTO(ReviewEntity review) {
        ReviewResponseDTO dto = new ReviewResponseDTO();
        dto.setReviewId(review.getId());
        dto.setBorrowId(review.getBorrow().getId()); // Set to null as it's not needed in the response
        dto.setItemDescriptionId(review.getItemDescription().getDescriptionId());
        dto.setReviewerName(review.getReviewer().getFullName());
        dto.setItemName(review.getItemDescription().getItemName());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setUpdatedAt(review.getUpdatedAt());
        return dto;
    }

    /**
     * Check if a borrower has already reviewed an item
     */
    public boolean hasReviewedItem(Integer borrowerId, Integer itemDescriptionId) {
        // Added logging to help debug
        boolean exists = reviewRepository.existsByReviewerIdAndItemDescriptionDescriptionId(borrowerId, itemDescriptionId);
        System.out.println("Checking if borrower " + borrowerId + " has reviewed item " + itemDescriptionId + ": " + exists);
        return exists;
    }
}