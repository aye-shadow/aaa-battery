package com.aaa_battery.aaa_batteryproject.borrows.controller;

import java.awt.print.Book;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;

import com.aaa_battery.aaa_batteryproject.borrows.model.BorrowEntity;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.service.ItemDescriptionService;
import com.aaa_battery.aaa_batteryproject.item.repository.ItemRepository;
import  com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;
import com.aaa_battery.aaa_batteryproject.item.model.ItemEntity;
import com.aaa_battery.aaa_batteryproject.item.service.ItemService;
import com.aaa_battery.aaa_batteryproject.user.service.BorrowerService;
import com.aaa_battery.aaa_batteryproject.borrows.service.BorrowService;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.AudiobookDescription;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.DVDDescription;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.BookDescription;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
            Long userId = ((Number) borrowData.get("userId")).longValue();
            Long itemId = ((Number) borrowData.get("itemId")).longValue();
            LocalDate borrowDate = LocalDate.parse((String) borrowData.get("borrowDate"));
            LocalDate returnDate = LocalDate.parse((String) borrowData.get("returnDate"));
            String notes = (String) borrowData.get("notes");

            // Fetch borrower
            BorrowerEntity borrower = borrowerService.findBorrowerById(userId);
            if (borrower == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Borrower not found");
            }

            // Fetch item
            // Assuming you have a service instance available
            ItemEntity item = itemService.findById(itemId);
            if (item == null || !item.isAvailability())
            {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Item not available");
            }

            // Create borrow request
            BorrowEntity borrow = new BorrowEntity();
            borrow.setBorrower(borrower);
            borrow.setItem(item);
            borrow.setRequestDate(ZonedDateTime.from(LocalDateTime.now()));
            borrow.setBorrowDate(ZonedDateTime.from(borrowDate));
            borrow.setReturnDate(ZonedDateTime.from(returnDate));
            borrow.setStatus("pending");
            borrow.setNotes(notes);
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
            return ResponseEntity.status(500).body("Failed to submit borrow request: " + e.getMessage());
        }
    }
}
