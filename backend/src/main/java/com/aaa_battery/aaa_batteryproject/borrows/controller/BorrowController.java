package com.aaa_battery.aaa_batteryproject.borrows.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
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
import org.springframework.web.bind.annotation.*;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

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
            Long userId = ((Number) borrowData.get("userId")).longValue();
            Long itemDescriptionId = ((Number) borrowData.get("itemId")).longValue();
            LocalDate borrowLocalDate = LocalDate.parse((String) borrowData.get("borrowDate"));
            LocalDate returnLocalDate = LocalDate.parse((String) borrowData.get("returnDate"));
            ZonedDateTime borrowDate = borrowLocalDate.atStartOfDay(ZoneId.systemDefault());
            ZonedDateTime returnDate = returnLocalDate.atStartOfDay(ZoneId.systemDefault());

            String notes = (String) borrowData.get("notes");

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
            itemService.addItem(item);  // Save the updated item state

            // Create borrow request
            BorrowEntity borrow = new BorrowEntity();
            borrow.setBorrower(borrower);
            borrow.setItem(item);
            borrow.setRequestDate(ZonedDateTime.now());
            borrow.setBorrowDate(borrowDate);
            borrow.setReturnDate(returnDate);
            borrow.setStatus("pending");
            borrow.setNotes(notes);


            borrower.addBorrowedItem(borrow);
            borrowerService.saveBorrower(borrower);

            // Save borrow request
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

            response.put("requestDate", borrow.getRequestDate());
            response.put("borrowDate", borrow.getBorrowDate());
            response.put("returnDate", borrow.getReturnDate());
            response.put("status", borrow.getStatus());
            response.put("notes", borrow.getNotes());

            return ResponseEntity.ok(Map.of("data", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to submit borrow request: " + e.getMessage());
        }
    }

}
