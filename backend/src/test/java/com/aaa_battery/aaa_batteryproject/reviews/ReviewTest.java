package com.aaa_battery.aaa_batteryproject.reviews;

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
import com.aaa_battery.aaa_batteryproject.reviews.model.ReviewEntity;
import com.aaa_battery.aaa_batteryproject.reviews.repository.ReviewRepository;
import com.aaa_battery.aaa_batteryproject.reviews.service.ReviewService;
import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;
import com.aaa_battery.aaa_batteryproject.user.services.UserService;
import jakarta.persistence.EntityNotFoundException;
import java.util.Date;
import java.util.Optional;

public class ReviewTest {
    
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
    
    // @Test
    // void testCreateReview_Success() {
    //     // Mock repository responses
    //     when(borrowRepository.findById(anyLong())).thenReturn(Optional.of(borrow));
    //     when(reviewRepository.existsByReviewerIdAndItemDescriptionDescriptionId(anyInt(), anyInt())).thenReturn(false);
        
    //     ReviewEntity savedReview = new ReviewEntity();
    //     savedReview.setId(1L);
    //     savedReview.setReviewer(borrower);
    //     savedReview.setItemDescription(itemDescription);
    //     savedReview.setBorrow(borrow);
    //     savedReview.setComment("Great item!");
    //     savedReview.setRating(4);
    //     savedReview.setCreatedAt(new Date());
        
    //     when(reviewRepository.save(any(ReviewEntity.class))).thenReturn(savedReview);
        
    //     // Test service method
    //     ReviewResponseDTO result = reviewService.createReview(borrower, reviewDTO);
        
    //     // Verify
    //     assertNotNull(result);
    //     assertEquals(1L, result.getReviewId());
    //     assertEquals(4, result.getRating());
        
    //     // Verify repository interactions
    //     verify(borrowRepository).findById(200L);
    //     verify(reviewRepository).save(any(ReviewEntity.class));
    //     verify(itemDescriptionRepository).save(any(ItemDescriptionEntity.class));
    // }
    
    // @Test
    // void testCreateReview_BorrowNotFound() {
    //     when(borrowRepository.findById(anyLong())).thenReturn(Optional.empty());
        
    //     // Test service method
    //     assertThrows(EntityNotFoundException.class, () -> {
    //         reviewService.createReview(borrower, reviewDTO);
    //     });
    // }
    
    // @Test
    // void testCreateReview_ItemNotReturned() {
    //     borrow.setStatus(BorrowStatus.BORROWED);
    //     when(borrowRepository.findById(anyLong())).thenReturn(Optional.of(borrow));
        
    //     // Test service method
    //     assertThrows(IllegalArgumentException.class, () -> {
    //         reviewService.createReview(borrower, reviewDTO);
    //     });
    // }
    
    // @Test
    // void testCreateReview_AlreadyReviewed() {
    //     when(borrowRepository.findById(anyLong())).thenReturn(Optional.of(borrow));
    //     when(reviewRepository.existsByReviewerIdAndItemDescriptionDescriptionId(anyInt(), anyInt())).thenReturn(true);
        
    //     // Test service method
    //     assertThrows(IllegalArgumentException.class, () -> {
    //         reviewService.createReview(borrower, reviewDTO);
    //     });
    // }
    
    // @Test
    // void testCreateReview_NotBorrower() {
    //     BorrowerEntity differentBorrower = new BorrowerEntity();
    //     differentBorrower.setId(2);
        
    //     when(borrowRepository.findById(anyLong())).thenReturn(Optional.of(borrow));
    //     when(reviewRepository.existsByReviewerIdAndItemDescriptionDescriptionId(anyInt(), anyInt())).thenReturn(false);
        
    //     // Test service method
    //     assertThrows(IllegalArgumentException.class, () -> {
    //         reviewService.createReview(differentBorrower, reviewDTO);
    //     });
    // }
    
    // @Test
    // void testControllerCreateReview_Success() {
    //     when(reviewService.hasReviewedItem(anyInt(), anyInt())).thenReturn(false);
        
    //     ReviewResponseDTO responseDTO = new ReviewResponseDTO();
    //     responseDTO.setReviewId(1L);
    //     responseDTO.setRating(4);
        
    //     when(reviewService.createReview(any(BorrowerEntity.class), any(ReviewCreateRequestDTO.class))).thenReturn(responseDTO);
        
    //     // Test controller method
    //     ResponseEntity<?> response = reviewController.createReview(reviewDTO);
        
    //     // Verify
    //     assertEquals(HttpStatus.CREATED, response.getStatusCode());
    //     assertInstanceOf(ReviewResponseDTO.class, response.getBody());
    // }
    
    // @Test
    // void testControllerCreateReview_BorrowIdNull() {
    //     reviewDTO.setBorrowId(null);
        
    //     // Test controller method
    //     ResponseEntity<?> response = reviewController.createReview(reviewDTO);
        
    //     // Verify
    //     assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    //     assertEquals("Borrow ID cannot be null", response.getBody());
    // }
    
    // @Test
    // void testControllerCreateReview_AlreadyReviewed() {
    //     when(reviewService.hasReviewedItem(anyInt(), anyInt())).thenReturn(true);
        
    //     // Test controller method
    //     ResponseEntity<?> response = reviewController.createReview(reviewDTO);
        
    //     // Verify
    //     assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    //     assertEquals("You have already reviewed this item", response.getBody());
    // }
    
    // @Test
    // void testControllerCreateReview_ServiceException() {
    //     when(reviewService.hasReviewedItem(anyInt(), anyInt())).thenReturn(false);
    //     when(reviewService.createReview(any(BorrowerEntity.class), any(ReviewCreateRequestDTO.class)))
    //         .thenThrow(new IllegalArgumentException("You have already reviewed this item"));
        
    //     // Test controller method
    //     ResponseEntity<?> response = reviewController.createReview(reviewDTO);
        
    //     // Verify
    //     assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    //     assertEquals("You have already reviewed this item", response.getBody());
    // }
}
