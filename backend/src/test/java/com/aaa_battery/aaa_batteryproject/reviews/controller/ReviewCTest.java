package com.aaa_battery.aaa_batteryproject.reviews.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import com.aaa_battery.aaa_batteryproject.borrows.model.BorrowEntity;
import com.aaa_battery.aaa_batteryproject.borrows.model.BorrowEntity.BorrowStatus;
import com.aaa_battery.aaa_batteryproject.borrows.repository.BorrowRepository;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.ItemDescriptionEntity;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.repository.ItemDescriptionRepository;
import com.aaa_battery.aaa_batteryproject.item.model.ItemEntity;
import com.aaa_battery.aaa_batteryproject.reviews.controller.ReviewController;
import com.aaa_battery.aaa_batteryproject.reviews.dto.ReviewCreateRequestDTO;
import com.aaa_battery.aaa_batteryproject.reviews.dto.ReviewResponseDTO;
import com.aaa_battery.aaa_batteryproject.reviews.dto.ReviewUpdateRequestDTO;
import com.aaa_battery.aaa_batteryproject.reviews.model.ReviewEntity;
import com.aaa_battery.aaa_batteryproject.reviews.repository.ReviewRepository;
import com.aaa_battery.aaa_batteryproject.reviews.service.ReviewService;
import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;
import com.aaa_battery.aaa_batteryproject.user.services.UserService;
import jakarta.persistence.EntityNotFoundException;

import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public class ReviewCTest {
    
    @Mock
    private ReviewRepository reviewRepository;
    
    @Mock
    private BorrowRepository borrowRepository;
    
    @Mock
    private ItemDescriptionRepository itemDescriptionRepository;
    
    @Mock
    private UserService userService;
    
    @Mock
    private SecurityContext securityContext;
    
    @Mock
    private Authentication authentication;
    
    @Mock
    private ReviewService reviewService;
    
    @InjectMocks
    private ReviewController reviewController;
    
    private BorrowerEntity borrower;
    private BorrowEntity borrow;
    private ItemEntity item;
    private ItemDescriptionEntity itemDescription;
    private ReviewCreateRequestDTO reviewDTO;
    
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        // Setup SecurityContext mock
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        
        // Setup test data
        borrower = new BorrowerEntity();
        borrower.setId(1);
        borrower.setUsername("testuser");
        borrower.setFullName("Test User");
        
        itemDescription = new ItemDescriptionEntity();
        itemDescription.setDescriptionId(100);
        itemDescription.setItemName("Test Item");
        
        item = new ItemEntity();
        item.setItemId(50);
        item.setDescription(itemDescription);
        
        borrow = new BorrowEntity();
        borrow.setId((int) 200L);
        borrow.setItem(item);
        borrow.setBorrower(borrower);
        borrow.setStatus(BorrowStatus.RETURNED);
        
        reviewDTO = new ReviewCreateRequestDTO();
        reviewDTO.setBorrowId(200L);
        reviewDTO.setItemId(100);
        reviewDTO.setRating(4);
        reviewDTO.setComment("Great item!");
        
        // Setup authentication
        when(authentication.getName()).thenReturn("testuser");
        when(userService.loadUserByUsername("testuser")).thenReturn(borrower);
    }

    @Test
    void testControllerCreateReview_AlreadyReviewed() {
        when(reviewService.hasReviewedItem(anyInt(), anyInt())).thenReturn(true);
        
        // Test controller method
        ResponseEntity<?> response = reviewController.createReview(reviewDTO);
        
        // Verify
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("You have already reviewed this item", response.getBody());
    }
    
    @Test
    void testControllerCreateReview_ServiceException() {
        when(reviewService.hasReviewedItem(anyInt(), anyInt())).thenReturn(false);
        when(reviewService.createReview(any(BorrowerEntity.class), any(ReviewCreateRequestDTO.class)))
            .thenThrow(new IllegalArgumentException("You have already reviewed this item"));
        
        // Test controller method
        ResponseEntity<?> response = reviewController.createReview(reviewDTO);
        
        // Verify
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("You have already reviewed this item", response.getBody());
    }
    
    @Test
    void testGetMyReviews_ReturnsReviewsList() {
        // Arrange
        ReviewResponseDTO review1 = new ReviewResponseDTO();
        review1.setReviewId(1L);
        review1.setRating(5);
        review1.setComment("Excellent!");

        ReviewResponseDTO review2 = new ReviewResponseDTO();
        review2.setReviewId(2L);
        review2.setRating(4);
        review2.setComment("Good!");

        when(authentication.getName()).thenReturn("testuser");
        when(userService.loadUserByUsername("testuser")).thenReturn(borrower);
        when(reviewService.getReviewsByBorrower(borrower)).thenReturn(Arrays.asList(review1, review2));

        // Act
        ResponseEntity<List<ReviewResponseDTO>> response = reviewController.getMyReviews();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        assertEquals(1L, response.getBody().get(0).getReviewId());
        assertEquals(2L, response.getBody().get(1).getReviewId());
    }

    @Test
    void testGetMyReviews_ReturnsEmptyList() {
        // Arrange
        when(authentication.getName()).thenReturn("testuser");
        when(userService.loadUserByUsername("testuser")).thenReturn(borrower);
        when(reviewService.getReviewsByBorrower(borrower)).thenReturn(Collections.emptyList());

        // Act
        ResponseEntity<List<ReviewResponseDTO>> response = reviewController.getMyReviews();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isEmpty());
    }

    @Test
    void testUpdateReview_Success() {
        ReviewUpdateRequestDTO updateDTO = new ReviewUpdateRequestDTO();
        updateDTO.setRating(5);
        updateDTO.setComment("Updated comment");

        ReviewResponseDTO responseDTO = new ReviewResponseDTO();
        responseDTO.setReviewId(1L);
        responseDTO.setRating(5);
        responseDTO.setComment("Updated comment");

        when(authentication.getName()).thenReturn("testuser");
        when(userService.loadUserByUsername("testuser")).thenReturn(borrower);
        when(reviewService.updateReview(borrower, 1L, updateDTO)).thenReturn(responseDTO);

        ResponseEntity<ReviewResponseDTO> response = reviewController.updateReview(1L, updateDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getReviewId());
        assertEquals(5, response.getBody().getRating());
        assertEquals("Updated comment", response.getBody().getComment());
    }

    @Test
    void testUpdateReview_ThrowsException() {
        ReviewUpdateRequestDTO updateDTO = new ReviewUpdateRequestDTO();
        updateDTO.setRating(5);
        updateDTO.setComment("Updated comment");

        when(authentication.getName()).thenReturn("testuser");
        when(userService.loadUserByUsername("testuser")).thenReturn(borrower);
        when(reviewService.updateReview(borrower, 1L, updateDTO))
            .thenThrow(new IllegalArgumentException("You can only update your own reviews"));

        assertThrows(IllegalArgumentException.class, () -> {
            reviewController.updateReview(1L, updateDTO);
        });
    }

    @Test
    void testDeleteReview_Success() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("testuser");
        when(userService.loadUserByUsername("testuser")).thenReturn(borrower);
        when(reviewService.deleteReview(borrower, 1L)).thenReturn(true);

        ResponseEntity<?> response = reviewController.deleteReview(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Review deleted successfully", response.getBody());
    }

    @Test
    void testDeleteReview_NotFoundOrUnauthorized() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("testuser");
        when(userService.loadUserByUsername("testuser")).thenReturn(borrower);
        when(reviewService.deleteReview(borrower, 1L)).thenReturn(false);

        ResponseEntity<?> response = reviewController.deleteReview(1L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Review not found or you are not authorized to delete this review", response.getBody());
    }

    @Test
    void testDeleteReview_Unauthenticated() {
        when(authentication.isAuthenticated()).thenReturn(false);

        ResponseEntity<?> response = reviewController.deleteReview(1L);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("No user logged in", response.getBody());
    }

    @Test
    void testDeleteReview_IllegalArgumentException() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("testuser");
        when(userService.loadUserByUsername("testuser")).thenReturn(borrower);
        when(reviewService.deleteReview(borrower, 1L)).thenThrow(new IllegalArgumentException("bad id"));

        ResponseEntity<?> response = reviewController.deleteReview(1L);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Invalid review ID"));
    }

    @Test
    void testDeleteReview_Exception() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("testuser");
        when(userService.loadUserByUsername("testuser")).thenReturn(borrower);
        when(reviewService.deleteReview(borrower, 1L)).thenThrow(new RuntimeException("fail"));

        ResponseEntity<?> response = reviewController.deleteReview(1L);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Error deleting review"));
    }

    @Test
    void testGetReviewsForItem_ReturnsList() {
        int itemDescriptionId = 100;
        ReviewResponseDTO review1 = new ReviewResponseDTO();
        review1.setReviewId(1L);
        review1.setRating(5);
        review1.setComment("Excellent!");

        ReviewResponseDTO review2 = new ReviewResponseDTO();
        review2.setReviewId(2L);
        review2.setRating(4);
        review2.setComment("Good!");

        when(reviewService.getReviewsForItem(itemDescriptionId)).thenReturn(Arrays.asList(review1, review2));

        ResponseEntity<List<ReviewResponseDTO>> response = reviewController.getReviewsForItem(itemDescriptionId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        assertEquals(1L, response.getBody().get(0).getReviewId());
        assertEquals(2L, response.getBody().get(1).getReviewId());
    }

    @Test
    void testGetReviewsForItem_ReturnsEmptyList() {
        int itemDescriptionId = 101;
        when(reviewService.getReviewsForItem(itemDescriptionId)).thenReturn(Collections.emptyList());

        ResponseEntity<List<ReviewResponseDTO>> response = reviewController.getReviewsForItem(itemDescriptionId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isEmpty());
    }
}