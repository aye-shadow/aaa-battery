package com.aaa_battery.aaa_batteryproject.borrows.util;

import com.aaa_battery.aaa_batteryproject.authentication.service.AuthenticationService;
import com.aaa_battery.aaa_batteryproject.authentication.util.LoginTest;
import com.aaa_battery.aaa_batteryproject.borrows.model.BorrowEntity;
import com.aaa_battery.aaa_batteryproject.borrows.service.BorrowService;
import com.aaa_battery.aaa_batteryproject.item.model.ItemEntity;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.BookDescription;
import com.aaa_battery.aaa_batteryproject.item.service.ItemService;
import com.aaa_battery.aaa_batteryproject.security.jwt.services.JwtService;
import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;
import com.aaa_battery.aaa_batteryproject.user.roles.Role;
import com.aaa_battery.aaa_batteryproject.user.services.BorrowerService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class BorrowTestUtil {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    // ========================
    // Login Integration
    // ========================

    public static String performLoginAndGetJwt(AuthenticationService authenticationService, JwtService jwtService, MockMvc mockMvc) throws Exception {
        String jwt = "mocked-jwt-token";
        String email = "test@example.com";
        String password = "password";
        Role role = Role.BORROWER;

        LoginTest.setUp(authenticationService, jwtService, mockMvc, jwt, email, password, role);
        LoginTest.loginUser(authenticationService, jwtService, mockMvc, jwt, email, password, role);

        return jwt;
    }

    // ========================
    // Submit Borrow
    // ========================

    public static void setUpSubmitBorrowSuccess(BorrowerService borrowerService, ItemService itemService, BorrowService borrowService) {
        BorrowerEntity borrower = createMockBorrower(1L);
        ItemEntity item = createMockItem(100L, true);
        BorrowEntity borrow = createMockBorrow(borrower, item, 500L);

        when(borrowerService.findBorrowerById(1L)).thenReturn(borrower);
        when(itemService.findAvailableItemByDescription(100L)).thenReturn(Optional.of(item));
        mockAuth(borrower);
    }

    public static void performSubmitBorrow(MockMvc mockMvc, String jwt) throws Exception {
        Map<String, Object> request = new HashMap<>();
        request.put("itemId", 100L);

        mockMvc.perform(post("/api/borrower/borrows")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + jwt)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    public static void setUpSubmitBorrowItemNotFound(BorrowerService borrowerService, ItemService itemService) {
        BorrowerEntity borrower = createMockBorrower(1L);
        when(borrowerService.findBorrowerById(1L)).thenReturn(borrower);
        when(itemService.findAvailableItemByDescription(100L)).thenReturn(Optional.empty());
        mockAuth(borrower);
    }

    public static void performSubmitBorrowExpectBadRequest(MockMvc mockMvc, String jwt) throws Exception {
        mockMvc.perform(post("/api/borrower/borrows")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + jwt)
                        .content(objectMapper.writeValueAsString(Map.of("itemId", 100L))))
                .andExpect(status().isBadRequest());
    }

    public static void setUpSubmitBorrowBorrowerNotFound(BorrowerService borrowerService) {
        when(borrowerService.findBorrowerById(1L)).thenReturn(null);
        mockAuth(createMockBorrower(1L));
    }

    public static void performSubmitBorrowExpectNotFound(MockMvc mockMvc, String jwt) throws Exception {
        mockMvc.perform(post("/api/borrower/borrows")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + jwt)
                        .content(objectMapper.writeValueAsString(Map.of("itemId", 100L))))
                .andExpect(status().isNotFound());
    }

    // ========================
    // Get My Borrows
    // ========================

    public static void setUpGetMyBorrows(BorrowerService borrowerService) {
        BorrowerEntity borrower = createMockBorrower(1L);
        borrower.setBorrowedItems(List.of(new BorrowEntity()));
        when(borrowerService.findBorrowerById(1L)).thenReturn(borrower);
        mockAuth(borrower);
    }

    public static void performGetMyBorrows(MockMvc mockMvc, String jwt) throws Exception {
        mockMvc.perform(get("/api/borrower/my-borrows")
                        .header("Authorization", "Bearer " + jwt))
                .andExpect(status().isOk());
    }

    public static void setUpBorrowerNotFound(BorrowerService borrowerService) {
        when(borrowerService.findBorrowerById(anyLong())).thenReturn(null);
        mockAuth(createMockBorrower(1L));
    }

    public static void performGetMyBorrowsExpectNotFound(MockMvc mockMvc, String jwt) throws Exception {
        mockMvc.perform(get("/api/borrower/my-borrows")
                        .header("Authorization", "Bearer " + jwt))
                .andExpect(status().isNotFound());
    }

    // ========================
    // Return Borrow
    // ========================

    public static void setUpReturnBorrowSuccess(BorrowerService borrowerService, BorrowService borrowService) {
        BorrowerEntity borrower = createMockBorrower(1L);
        ItemEntity item = createMockItem(100L, false);

        BorrowEntity borrow = new BorrowEntity();
        borrow.setId(500);
        borrow.setBorrower(borrower);
        borrow.setItem(item);
        borrow.setStatus(BorrowEntity.BorrowStatus.BORROWED);
        borrow.setBorrowDate(new Date());
        borrow.setReturnDate(null);

        when(borrowerService.findBorrowerById(1L)).thenReturn(borrower);
        when(borrowService.findById(500L)).thenReturn(Optional.of(borrow));

        mockAuth(borrower);
    }

    public static void performReturnBorrow(MockMvc mockMvc, String jwt, Long id) throws Exception {
        mockMvc.perform(post("/api/borrower/return")
                        .param("id", id.toString())
                        .header("Authorization", "Bearer " + jwt))
                .andExpect(status().isOk());
    }

    public static void setUpReturnBorrowForbidden(BorrowerService borrowerService, BorrowService borrowService) {
        BorrowerEntity otherUser = createMockBorrower(2L);
        BorrowerEntity borrower = createMockBorrower(1L);
        ItemEntity item = createMockItem(100L, false);
        BorrowEntity borrow = createMockBorrow(otherUser, item, 500L);

        when(borrowerService.findBorrowerById(1L)).thenReturn(borrower);
        when(borrowService.findById(500L)).thenReturn(Optional.of(borrow));

        mockAuth(borrower);
    }

    public static void performReturnBorrowExpectForbidden(MockMvc mockMvc, String jwt, Long id) throws Exception {
        mockMvc.perform(post("/api/borrower/return")
                        .param("id", id.toString())
                        .header("Authorization", "Bearer " + jwt))
                .andExpect(status().isForbidden());
    }

    public static void setUpReturnBorrowNotFound(BorrowerService borrowerService, BorrowService borrowService) {
        BorrowerEntity borrower = createMockBorrower(1L);

        when(borrowerService.findBorrowerById(1L)).thenReturn(borrower);
        when(borrowService.findById(999L)).thenReturn(Optional.empty());
        mockAuth(borrower);
    }

    public static void performReturnBorrowExpectNotFound(MockMvc mockMvc, String jwt, Long id) throws Exception {
        mockMvc.perform(post("/api/borrower/return")
                        .param("id", id.toString())
                        .header("Authorization", "Bearer " + jwt))
                .andExpect(status().isNotFound());
    }

    // ========================
    // Helpers
    // ========================

    private static BorrowerEntity createMockBorrower(Long id) {
        BorrowerEntity borrower = new BorrowerEntity();
        borrower.setId(id.intValue());
        borrower.setFullName("Test User");
        borrower.setEmail("test@example.com");
        return borrower;
    }

    private static ItemEntity createMockItem(Long id, boolean available) {
        ItemEntity item = new ItemEntity();
        item.setItemId(id.intValue());
        item.setAvailability(available);

        BookDescription book = new BookDescription();
        book.setItemName("Mock Book");
        book.setAuthorName("Author X");
        book.setType("book");

        item.setDescription(book);
        return item;
    }


    private static BorrowEntity createMockBorrow(BorrowerEntity borrower, ItemEntity item, Long borrowId) {
        BorrowEntity borrow = new BorrowEntity();
        borrow.setId(borrowId.intValue());
        borrow.setBorrower(borrower);
        borrow.setItem(item);
        borrow.setStatus(BorrowEntity.BorrowStatus.BORROWED);
        borrow.setBorrowDate(new Date());
        borrow.setReturnDate(null);
        return borrow;
    }

    private static void mockAuth(BorrowerEntity borrower) {
        Authentication mockAuth = Mockito.mock(Authentication.class);
        when(mockAuth.getPrincipal()).thenReturn(borrower);
        SecurityContextHolder.getContext().setAuthentication(mockAuth);
    }
}
