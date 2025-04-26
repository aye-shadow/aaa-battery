package com.aaa_battery.aaa_batteryproject.borrows.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import com.aaa_battery.aaa_batteryproject.borrows.model.BorrowEntity;
import  com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;
import com.aaa_battery.aaa_batteryproject.item.model.ItemEntity;
import com.aaa_battery.aaa_batteryproject.item.service.ItemService;
import com.aaa_battery.aaa_batteryproject.user.services.BorrowerService;
import com.aaa_battery.aaa_batteryproject.borrows.service.BorrowService;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.AudiobookDescription;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.DVDDescription;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.BookDescription;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/borrower")
public class BorrowController {

    private final ItemService itemService;
    private final BorrowerService borrowerService;
    private final BorrowService borrowService;
    @Autowired
    public BorrowController(ItemService itemService, BorrowerService borrowerService, BorrowService borrowService) {
        this.itemService = itemService;
        this.borrowerService = borrowerService;
        this.borrowService = borrowService;
    }

    @PostMapping("/borrows")
    public ResponseEntity<?> submitBorrowRequest(@RequestBody Map<String, Object> borrowData) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            BorrowerEntity currentBorrower = (BorrowerEntity) authentication.getPrincipal();
            Long userId = ((Number) currentBorrower.getId()).longValue();

            Long itemDescriptionId = ((Number) borrowData.get("itemId")).longValue();

            Date borrowDate = new Date(); // get current date and time
            Date returnDate = Date.from(borrowDate.toInstant().plusSeconds(14 * 24 * 60 * 60)); // 14 days in seconds

            // Fetch borrower
            BorrowerEntity borrower = borrowerService.findBorrowerById(userId);
            if (borrower == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Borrower not found");
            }

            // Fetch available item
            Optional<ItemEntity> optionalItem = itemService.findAvailableItemByDescription(itemDescriptionId);
            if (optionalItem.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("No available item found for description ID: " + itemDescriptionId);
            }

            // Retrieve the item and mark it as unavailable
            ItemEntity item = optionalItem.get();
            item.setAvailability(false);

            // Create borrow request
            BorrowEntity borrow = new BorrowEntity();
            borrow.setBorrower(borrower);
            borrow.setItem(item);
            borrow.setBorrowDate(borrowDate);
            borrow.setReturnDate(returnDate);

            // Add borrow to borrower
            borrower.addBorrowedItem(borrow);

            // Save borrow request (cascades to item and borrower if configured)
            borrowService.saveBorrowRequest(borrow);

            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("id", borrow.getId());
            response.put("borrower", Map.of("id", borrower.getId(), "name", borrower.getFullName(), "email", borrower.getEmail()));
            response.put("item", Map.of(
                    "id", item.getItemId(),
                    "title", item.getDescription().getItemName(),
                    "creator", item.getDescription().getType().equalsIgnoreCase("book")
                            ? ((BookDescription) item.getDescription()).getAuthorName()
                            : item.getDescription().getType().equalsIgnoreCase("audiobook")
                            ? ((AudiobookDescription) item.getDescription()).getAuthorName()
                            : item.getDescription().getType().equalsIgnoreCase("dvd")
                            ? ((DVDDescription) item.getDescription()).getProducer()
                            : "Unknown", // Fallback for an unknown type
                    "type", item.getDescription().getType()
            ));
            response.put("borrowDate", borrow.getBorrowDate());
            response.put("returnDate", borrow.getReturnDate());

            return ResponseEntity.ok(Map.of("data", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to submit borrow: " + e.getMessage());
        }
    }

    @GetMapping("/my-borrows")
    public ResponseEntity<?> getMyBorrows() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            BorrowerEntity currentBorrower = (BorrowerEntity) authentication.getPrincipal();

            Long userId = ((Number) currentBorrower.getId()).longValue();
            currentBorrower = borrowerService.findBorrowerById(userId);
            if (currentBorrower == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Borrower not found");
            }

            return ResponseEntity.ok(currentBorrower.getBorrowedItems());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve borrows: " + e.getMessage());
        }
    }
}
