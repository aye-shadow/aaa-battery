package com.aaa_battery.aaa_batteryproject.reviews.service;

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

public class ReviewSTest {
    
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
    
    @InjectMocks
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
    void testCreateReview_Success() {
        // Mock repository responses
        when(borrowRepository.findById(anyLong())).thenReturn(Optional.of(borrow));
        when(reviewRepository.existsByReviewerIdAndItemDescriptionDescriptionId(anyInt(), anyInt())).thenReturn(false);
        
        ReviewEntity savedReview = new ReviewEntity();
        savedReview.setId(1L);
        savedReview.setReviewer(borrower);
        savedReview.setItemDescription(itemDescription);
        savedReview.setBorrow(borrow);
        savedReview.setComment("Great item!");
        savedReview.setRating(4);
        savedReview.setCreatedAt(new Date());
        
        when(reviewRepository.save(any(ReviewEntity.class))).thenReturn(savedReview);
        
        // Test service method
        ReviewResponseDTO result = reviewService.createReview(borrower, reviewDTO);
        
        // Verify
        assertNotNull(result);
        assertEquals(1L, result.getReviewId());
        assertEquals(4, result.getRating());
        
        // Verify repository interactions
        verify(borrowRepository).findById(200L);
        verify(reviewRepository, times(2)).save(any(ReviewEntity.class));
        verify(itemDescriptionRepository).save(any(ItemDescriptionEntity.class));
    }
    
    @Test
    void testCreateReview_BorrowNotFound() {
        when(borrowRepository.findById(anyLong())).thenReturn(Optional.empty());
        
        // Test service method
        assertThrows(EntityNotFoundException.class, () -> {
            reviewService.createReview(borrower, reviewDTO);
        });
    }
    
    @Test
    void testCreateReview_ItemNotReturned() {
        borrow.setStatus(BorrowStatus.BORROWED);
        when(borrowRepository.findById(anyLong())).thenReturn(Optional.of(borrow));
        
        // Test service method
        assertThrows(IllegalArgumentException.class, () -> {
            reviewService.createReview(borrower, reviewDTO);
        });
    }
    
    @Test
    void testCreateReview_AlreadyReviewed() {
        when(borrowRepository.findById(anyLong())).thenReturn(Optional.of(borrow));
        when(reviewRepository.existsByReviewerIdAndItemDescriptionDescriptionId(anyInt(), anyInt())).thenReturn(true);
        
        // Test service method
        assertThrows(IllegalArgumentException.class, () -> {
            reviewService.createReview(borrower, reviewDTO);
        });
    }
    
    @Test
    void testCreateReview_NotBorrower() {
        BorrowerEntity differentBorrower = new BorrowerEntity();
        differentBorrower.setId(2);
        
        when(borrowRepository.findById(anyLong())).thenReturn(Optional.of(borrow));
        when(reviewRepository.existsByReviewerIdAndItemDescriptionDescriptionId(anyInt(), anyInt())).thenReturn(false);
        
        // Test service method
        assertThrows(IllegalArgumentException.class, () -> {
            reviewService.createReview(differentBorrower, reviewDTO);
        });
    }
    
    @Test
    void testControllerCreateReview_BorrowIdNull() {
        reviewDTO.setBorrowId(null);
        
        // Test controller method
        ResponseEntity<?> response = reviewController.createReview(reviewDTO);
        
        // Verify
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Borrow ID cannot be null", response.getBody());
    }

    @Test
    void testGetReviewsByBorrower_ReturnsList() {
        // Arrange
        ReviewEntity review1 = new ReviewEntity();
        review1.setId(1L);
        review1.setReviewer(borrower);
        review1.setComment("Nice");
        review1.setRating(5);
        review1.setBorrow(borrow); // <-- Fix: set borrow
        review1.setItemDescription(itemDescription); // <-- Fix: set itemDescription

        ReviewEntity review2 = new ReviewEntity();
        review2.setId(2L);
        review2.setReviewer(borrower);
        review2.setComment("Okay");
        review2.setRating(3);
        review2.setBorrow(borrow); // <-- Fix: set borrow
        review2.setItemDescription(itemDescription); // <-- Fix: set itemDescription

        when(reviewRepository.findByReviewer(borrower)).thenReturn(Arrays.asList(review1, review2));
    
        // Act
        List<ReviewResponseDTO> result = reviewService.getReviewsByBorrower(borrower);
    
        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).getReviewId());
        assertEquals(2L, result.get(1).getReviewId());
    }

    @Test
    void testGetReviewsByBorrower_ReturnsEmptyList() {
        // Arrange
        when(reviewRepository.findByReviewer(borrower)).thenReturn(Collections.emptyList());

        // Act
        List<ReviewResponseDTO> result = reviewService.getReviewsByBorrower(borrower);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void testUpdateReview_Success() {
        ReviewUpdateRequestDTO updateDTO = new ReviewUpdateRequestDTO();
        updateDTO.setRating(5);
        updateDTO.setComment("Updated comment");

        ReviewEntity review = new ReviewEntity();
        review.setId(1L);
        review.setReviewer(borrower);
        review.setItemDescription(itemDescription);
        review.setBorrow(borrow);
        review.setRating(4);
        review.setComment("Old comment");

        when(reviewRepository.findById(1L)).thenReturn(Optional.of(review));
        when(reviewRepository.save(any(ReviewEntity.class))).thenReturn(review);
        when(reviewRepository.findByItemDescription(itemDescription)).thenReturn(Collections.singletonList(review));
        when(itemDescriptionRepository.save(any(ItemDescriptionEntity.class))).thenReturn(itemDescription);

        ReviewResponseDTO result = reviewService.updateReview(borrower, 1L, updateDTO);

        assertNotNull(result);
        assertEquals(1L, result.getReviewId());
        assertEquals(5, result.getRating());
        assertEquals("Updated comment", result.getComment());
    }

    @Test
    void testUpdateReview_ReviewNotFound() {
        ReviewUpdateRequestDTO updateDTO = new ReviewUpdateRequestDTO();
        when(reviewRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> {
            reviewService.updateReview(borrower, 1L, updateDTO);
        });
    }

    @Test
    void testUpdateReview_NotOwner() {
        ReviewUpdateRequestDTO updateDTO = new ReviewUpdateRequestDTO();
        BorrowerEntity otherBorrower = new BorrowerEntity();
        otherBorrower.setId(2);

        ReviewEntity review = new ReviewEntity();
        review.setId(1L);
        review.setReviewer(otherBorrower); // Not the same as 'borrower'
        review.setItemDescription(itemDescription);

        when(reviewRepository.findById(1L)).thenReturn(Optional.of(review));

        assertThrows(IllegalArgumentException.class, () -> {
            reviewService.updateReview(borrower, 1L, updateDTO);
        });
    }

    @Test
    void testDeleteReview_Success() {
        ReviewEntity review = new ReviewEntity();
        review.setId(1L);
        review.setReviewer(borrower);

        when(reviewRepository.findById(1L)).thenReturn(Optional.of(review));

        boolean result = reviewService.deleteReview(borrower, 1L);

        assertTrue(result);
        verify(reviewRepository).delete(review);
    }

    @Test
    void testDeleteReview_ReviewNotFound() {
        when(reviewRepository.findById(1L)).thenReturn(Optional.empty());

        boolean result = reviewService.deleteReview(borrower, 1L);

        assertFalse(result);
        verify(reviewRepository, never()).delete(any());
    }

    @Test
    void testDeleteReview_NotOwner() {
        BorrowerEntity other = new BorrowerEntity();
        other.setId(2);
        ReviewEntity review = new ReviewEntity();
        review.setId(1L);
        review.setReviewer(other);

        when(reviewRepository.findById(1L)).thenReturn(Optional.of(review));

        boolean result = reviewService.deleteReview(borrower, 1L);

        assertFalse(result);
        verify(reviewRepository, never()).delete(any());
    }

    @Test
    void testDeleteReview_Exception() {
        ReviewEntity review = new ReviewEntity();
        review.setId(1L);
        review.setReviewer(borrower);

        when(reviewRepository.findById(1L)).thenReturn(Optional.of(review));
        doThrow(new RuntimeException("fail")).when(reviewRepository).delete(review);

        boolean result = reviewService.deleteReview(borrower, 1L);

        assertFalse(result);
    }

    @Test
    void testGetReviewsForItem_ReturnsList() {
        int itemDescriptionId = 100;
        ItemDescriptionEntity itemDescription = new ItemDescriptionEntity();
        itemDescription.setDescriptionId(itemDescriptionId);
    
        ReviewEntity review1 = new ReviewEntity();
        review1.setId(1L);
        review1.setRating(5);
        review1.setComment("Excellent!");
        review1.setItemDescription(itemDescription);
        review1.setReviewer(borrower); // <-- Add this line
        review1.setBorrow(borrow);
    
        ReviewEntity review2 = new ReviewEntity();
        review2.setId(2L);
        review2.setRating(4);
        review2.setComment("Good!");
        review2.setItemDescription(itemDescription);
        review2.setReviewer(borrower); // <-- Add this line
        review2.setBorrow(borrow);
    
        when(reviewRepository.findByItemDescription(any(ItemDescriptionEntity.class)))
            .thenReturn(Arrays.asList(review1, review2));
    
        List<ReviewResponseDTO> result = reviewService.getReviewsForItem(itemDescriptionId);
    
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).getReviewId());
        assertEquals(2L, result.get(1).getReviewId());
    }

    @Test
    void testGetReviewsForItem_ReturnsEmptyList() {
        int itemDescriptionId = 101;
        when(reviewRepository.findByItemDescription(any(ItemDescriptionEntity.class)))
            .thenReturn(Collections.emptyList());

        List<ReviewResponseDTO> result = reviewService.getReviewsForItem(itemDescriptionId);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }
    }