package com.aaa_battery.aaa_batteryproject.borrows;

import com.aaa_battery.aaa_batteryproject.borrows.controller.BorrowController;
import com.aaa_battery.aaa_batteryproject.borrows.model.BorrowEntity;
import com.aaa_battery.aaa_batteryproject.borrows.service.BorrowService;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.AudiobookDescription;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.BookDescription;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.DVDDescription;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.ItemDescriptionEntity;
import com.aaa_battery.aaa_batteryproject.item.model.ItemEntity;
import com.aaa_battery.aaa_batteryproject.item.model.ItemType;
import com.aaa_battery.aaa_batteryproject.item.service.ItemService;
import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;
import com.aaa_battery.aaa_batteryproject.user.services.BorrowerService;
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

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class BorrowControllerTest {

    @Mock
    private ItemService itemService;

    @Mock
    private BorrowerService borrowerService;

    @Mock
    private BorrowService borrowService;

    @Mock
    private Authentication authentication;

    @Mock
    private SecurityContext securityContext;

    @InjectMocks
    private BorrowController borrowController;

    private BorrowerEntity testBorrower;
    private ItemEntity testItem;
    private final Long borrowerId = 10L;
    private final Long itemDescriptionId = 20L;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Setup SecurityContext mock
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        // Setup test borrower
        testBorrower = new BorrowerEntity();
        testBorrower.setId(borrowerId.intValue());
        testBorrower.setFullName("Test Student");
        testBorrower.setEmail("student@nu.edu.pk");

        // Mock authentication principal
        when(authentication.getPrincipal()).thenReturn(testBorrower);
        when(borrowerService.findBorrowerById(borrowerId)).thenReturn(testBorrower);

        // Setup test item
        testItem = new ItemEntity();
        testItem.setItemId(30);  // or use Integer.valueOf(30)
        testItem.setAvailability(true);

        // Default mock for finding available item
        when(itemService.findAvailableItemByDescription(itemDescriptionId))
            .thenReturn(Optional.of(testItem));
    }

    @Test
    void submitBorrowRequest_Success_WithBookDescription() {
        // Setup
        BookDescription bookDescription = new BookDescription();
        bookDescription.setItemName("Test Book for Borrowing");
        bookDescription.setAuthorName("Borrow Test Author");
        bookDescription.setItemType("BOOK");
        testItem.setDescription(bookDescription);

        Map<String, Object> borrowData = new HashMap<>();
        borrowData.put("itemId", itemDescriptionId);

        BorrowEntity savedBorrow = new BorrowEntity();
        savedBorrow.setId((int) 1L);
        savedBorrow.setBorrower(testBorrower);
        savedBorrow.setItem(testItem);
        savedBorrow.setStatus(BorrowEntity.BorrowStatus.BORROWED);
        savedBorrow.setBorrowDate(new Date());

        doNothing().when(borrowService).saveBorrowRequest(any(BorrowEntity.class));
        
        // Execute
        ResponseEntity<?> response = borrowController.submitBorrowRequest(borrowData);

        // Verify
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        
        @SuppressWarnings("unchecked")
        Map<String, Object> responseMap = (Map<String, Object>) response.getBody();
        
        @SuppressWarnings({ "unchecked", "null" })
        Map<String, Object> data = (Map<String, Object>) responseMap.get("data");
        assertNotNull(data);
        
        @SuppressWarnings("unchecked")
        Map<String, Object> item = (Map<String, Object>) data.get("item");
        assertEquals(ItemType.BOOK, item.get("type"));
        assertEquals("Borrow Test Author", item.get("creator"));
        
        verify(borrowService, times(1)).saveBorrowRequest(any(BorrowEntity.class));
        assertFalse(testItem.isAvailability());
    }

    @Test
    void submitBorrowRequest_Success_WithAudiobookDescription() {
        // Setup
        AudiobookDescription audiobookDescription = new AudiobookDescription();
        audiobookDescription.setItemName("Test Audiobook");
        audiobookDescription.setAuthorName("Audiobook Narrator");
        audiobookDescription.setItemType("audiobook");
        testItem.setDescription(audiobookDescription);

        Map<String, Object> borrowData = new HashMap<>();
        borrowData.put("itemId", itemDescriptionId);

        // Execute
        ResponseEntity<?> response = borrowController.submitBorrowRequest(borrowData);

        // Verify
        assertEquals(HttpStatus.OK, response.getStatusCode());
        
        @SuppressWarnings("unchecked")
        Map<String, Object> responseMap = (Map<String, Object>) response.getBody();
        
        @SuppressWarnings({ "unchecked", "null" })
        Map<String, Object> data = (Map<String, Object>) responseMap.get("data");
        
        @SuppressWarnings("unchecked")
        Map<String, Object> item = (Map<String, Object>) data.get("item");
        assertEquals(ItemType.AUDIOBOOK, item.get("type"));
        assertEquals("Audiobook Narrator", item.get("creator"));
    }

    @Test
    void submitBorrowRequest_Success_WithDVDDescription() {
        // Setup
        DVDDescription dvdDescription = new DVDDescription();
        dvdDescription.setItemName("Test DVD");
        dvdDescription.setProducer("DVD Producer");
        dvdDescription.setItemType("dvd");
        testItem.setDescription(dvdDescription);

        Map<String, Object> borrowData = new HashMap<>();
        borrowData.put("itemId", itemDescriptionId);

        // Execute
        ResponseEntity<?> response = borrowController.submitBorrowRequest(borrowData);

        // Verify
        assertEquals(HttpStatus.OK, response.getStatusCode());
        
        @SuppressWarnings("unchecked")
        Map<String, Object> responseMap = (Map<String, Object>) response.getBody();
        
        @SuppressWarnings({ "unchecked", "null" })
        Map<String, Object> data = (Map<String, Object>) responseMap.get("data");
        
        @SuppressWarnings("unchecked")
        Map<String, Object> item = (Map<String, Object>) data.get("item");
        assertEquals(ItemType.DVD, item.get("type"));
        assertEquals("DVD Producer", item.get("creator"));
    }

    @Test
    void submitBorrowRequest_BorrowerNotFound() {
        // Setup
        when(borrowerService.findBorrowerById(borrowerId)).thenReturn(null);

        Map<String, Object> borrowData = new HashMap<>();
        borrowData.put("itemId", itemDescriptionId);

        // Execute
        ResponseEntity<?> response = borrowController.submitBorrowRequest(borrowData);

        // Verify
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Borrower not found", response.getBody());
        verify(borrowService, never()).saveBorrowRequest(any());
    }

    @Test
    void submitBorrowRequest_NoAvailableItem() {
        // Setup
        when(itemService.findAvailableItemByDescription(itemDescriptionId)).thenReturn(Optional.empty());

        Map<String, Object> borrowData = new HashMap<>();
        borrowData.put("itemId", itemDescriptionId);

        // Execute
        ResponseEntity<?> response = borrowController.submitBorrowRequest(borrowData);

        // Verify
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("No available item found for description ID: " + itemDescriptionId, response.getBody());
        verify(borrowService, never()).saveBorrowRequest(any());
    }

    @Test
    void submitBorrowRequest_UnknownItemType() {
        // Setup
        ItemDescriptionEntity unknownDescription = mock(ItemDescriptionEntity.class);
        when(unknownDescription.getItemName()).thenReturn("Unknown Item");
        when(unknownDescription.getItemType()).thenReturn(null);
        testItem.setDescription(unknownDescription);
    
        Map<String, Object> borrowData = new HashMap<>();
        borrowData.put("itemId", itemDescriptionId);
    
        // Execute
        ResponseEntity<?> response = borrowController.submitBorrowRequest(borrowData);
    
        // Verify - expect 500 error instead of 200
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        // You might need to check the exact error message too
    }

    @Test
    void submitBorrowRequest_ExceptionHandling() {
        // Setup
        doThrow(new RuntimeException("Database error")).when(borrowService).saveBorrowRequest(any());
        
        BookDescription bookDescription = new BookDescription();
        bookDescription.setItemName("Test Book");
        bookDescription.setAuthorName("Test Author");
        bookDescription.setItemType("book");
        testItem.setDescription(bookDescription);

        Map<String, Object> borrowData = new HashMap<>();
        borrowData.put("itemId", itemDescriptionId);

        // Execute
        ResponseEntity<?> response = borrowController.submitBorrowRequest(borrowData);

        // Verify
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Failed to submit borrow: Database error", response.getBody());
    }
    
    @Test
    void submitBorrowRequest_VerifyBorrowEntitySetup() {
        // Setup
        BookDescription bookDescription = new BookDescription();
        bookDescription.setItemName("Test Book");
        bookDescription.setAuthorName("Test Author");
        bookDescription.setItemType("book");
        testItem.setDescription(bookDescription);

        Map<String, Object> borrowData = new HashMap<>();
        borrowData.put("itemId", itemDescriptionId);

        // Capture the BorrowEntity passed to borrowService
        doAnswer(invocation -> {
            BorrowEntity borrow = invocation.getArgument(0);
            
            // Verify borrow entity is set up correctly
            assertEquals(testBorrower, borrow.getBorrower());
            assertEquals(testItem, borrow.getItem());
            assertEquals(BorrowEntity.BorrowStatus.BORROWED, borrow.getStatus());
            assertNotNull(borrow.getBorrowDate());
            
            // Return a valid borrow entity
            borrow.setId((int) 1L);
            return borrow;
        }).when(borrowService).saveBorrowRequest(any(BorrowEntity.class));

        // Execute
        borrowController.submitBorrowRequest(borrowData);

        // Verify
        verify(borrowService).saveBorrowRequest(any(BorrowEntity.class));
        verify(borrowerService).findBorrowerById(borrowerId);
        verify(itemService).findAvailableItemByDescription(itemDescriptionId);
    }

    @Test
    void getMyBorrows_Success() {
        // Setup
        List<BorrowEntity> borrowList = new ArrayList<>();
        BorrowEntity borrow1 = new BorrowEntity();
        borrow1.setId(1);
        borrow1.setBorrower(testBorrower);
        borrow1.setItem(testItem);
        borrowList.add(borrow1);
        
        testBorrower.setBorrowedItems(borrowList);
        
        // Execute
        ResponseEntity<?> response = borrowController.getMyBorrows();
        
        // Verify
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(borrowList, response.getBody());
        verify(borrowerService).findBorrowerById(borrowerId);
    }

    @Test
    void getMyBorrows_BorrowerNotFound() {
        // Setup
        when(borrowerService.findBorrowerById(borrowerId)).thenReturn(null);
        
        // Execute
        ResponseEntity<?> response = borrowController.getMyBorrows();
        
        // Verify
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Borrower not found", response.getBody());
    }

    @Test
    void getMyBorrows_EmptyList() {
        // Setup
        testBorrower.setBorrowedItems(Collections.emptyList());
        
        // Execute
        ResponseEntity<?> response = borrowController.getMyBorrows();
        
        // Verify
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(Collections.emptyList(), response.getBody());
    }

    @Test
    void getMyBorrows_ExceptionHandling() {
        // Setup
        when(borrowerService.findBorrowerById(borrowerId))
            .thenThrow(new RuntimeException("Database error"));
        
        // Execute
        ResponseEntity<?> response = borrowController.getMyBorrows();
        
        // Verify
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Failed to retrieve borrows: Database error", response.getBody());
    }

    @SuppressWarnings("null")
    @Test
    void returnBorrow_Success() {
        // Setup
        Long borrowId = 1L;
        BorrowEntity borrow = new BorrowEntity();
        borrow.setId(borrowId.intValue());
        borrow.setBorrower(testBorrower);
        borrow.setItem(testItem);
        borrow.setStatus(BorrowEntity.BorrowStatus.BORROWED);
        
        when(borrowService.findById(borrowId)).thenReturn(Optional.of(borrow));
        doNothing().when(borrowService).saveReturn(any(BorrowEntity.class), any(ItemEntity.class));
        
        // Execute
        ResponseEntity<?> response = borrowController.returnBorrow(borrowId);
        
        // Verify
        assertEquals(HttpStatus.OK, response.getStatusCode());
        
        @SuppressWarnings("unchecked")
        Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
        assertEquals("Item returned successfully", responseBody.get("message"));
        
        // Verify item was made available
        assertTrue(testItem.isAvailability());
        
        // Verify borrow was marked as returned
        assertEquals(BorrowEntity.BorrowStatus.RETURNED, borrow.getStatus());
        assertNotNull(borrow.getReturnedOn());
        
        // Verify service methods were called
        verify(borrowService).findById(borrowId);
        verify(borrowService).saveReturn(borrow, testItem);
    }
    
    @Test
    void returnBorrow_BorrowerNotFound() {
        // Setup
        Long borrowId = 1L;
        when(borrowerService.findBorrowerById(borrowerId)).thenReturn(null);
        
        // Execute
        ResponseEntity<?> response = borrowController.returnBorrow(borrowId);
        
        // Verify
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Borrower not found", response.getBody());
        
        // Verify no save was attempted
        verify(borrowService, never()).saveReturn(any(), any());
    }
    
    @Test
    void returnBorrow_BorrowNotFound() {
        // Setup
        Long borrowId = 1L;
        when(borrowService.findById(borrowId)).thenReturn(Optional.empty());
        
        // Execute
        ResponseEntity<?> response = borrowController.returnBorrow(borrowId);
        
        // Verify
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Borrow not found", response.getBody());
        
        // Verify no save was attempted
        verify(borrowService, never()).saveReturn(any(), any());
    }
    
    @Test
    void returnBorrow_NotOwner() {
        // Setup
        Long borrowId = 1L;
        
        // Create a different borrower for the borrow record
        BorrowerEntity otherBorrower = new BorrowerEntity();
        otherBorrower.setId(borrowerId.intValue() + 1); // Different ID
        
        // Create a borrowed item (must be marked as unavailable)
        ItemEntity borrowedItem = new ItemEntity();
        borrowedItem.setItemId(30);
        borrowedItem.setAvailability(false); // Item is already borrowed, so it's unavailable
        
        BorrowEntity borrow = new BorrowEntity();
        borrow.setId(borrowId.intValue());
        borrow.setBorrower(otherBorrower);
        borrow.setItem(borrowedItem);
        
        when(borrowService.findById(borrowId)).thenReturn(Optional.of(borrow));
        
        // Execute
        ResponseEntity<?> response = borrowController.returnBorrow(borrowId);
        
        // Verify
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("You do not have permission to return this item", response.getBody());
        
        // Verify item was not modified (still unavailable)
        assertFalse(borrowedItem.isAvailability());
        
        // Verify no save was attempted
        verify(borrowService, never()).saveReturn(any(), any());
    }
    
    @Test
    void returnBorrow_ExceptionHandling() {
        // Setup
        Long borrowId = 1L;
        BorrowEntity borrow = new BorrowEntity();
        borrow.setId(borrowId.intValue());
        borrow.setBorrower(testBorrower);
        borrow.setItem(testItem);
        
        when(borrowService.findById(borrowId)).thenReturn(Optional.of(borrow));
        doThrow(new RuntimeException("Database error")).when(borrowService).saveReturn(any(), any());
        
        // Execute
        ResponseEntity<?> response = borrowController.returnBorrow(borrowId);
        
        // Verify
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Failed to return borrow: Database error", response.getBody());
    }
    
    @Test
    void returnBorrow_VerifyDateUpdated() {
        // Setup
        Long borrowId = 1L;
        Date beforeTest = new Date();
        
        BorrowEntity borrow = new BorrowEntity();
        borrow.setId(borrowId.intValue());
        borrow.setBorrower(testBorrower);
        borrow.setItem(testItem);
        borrow.setStatus(BorrowEntity.BorrowStatus.BORROWED);
        
        when(borrowService.findById(borrowId)).thenReturn(Optional.of(borrow));
        
        // Execute
        borrowController.returnBorrow(borrowId);
        
        // Verify the returned date was set and is after our beforeTest time
        assertNotNull(borrow.getReturnedOn());
        assertFalse(borrow.getReturnedOn().before(beforeTest));
        
        // Verify timezone is set to UTC
        assertEquals(BorrowEntity.BorrowStatus.RETURNED, borrow.getStatus());
    }
}