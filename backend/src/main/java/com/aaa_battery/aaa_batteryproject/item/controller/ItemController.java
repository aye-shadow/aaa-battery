package com.aaa_battery.aaa_batteryproject.item.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.aaa_battery.aaa_batteryproject.item.model.ItemEntity;
import com.aaa_battery.aaa_batteryproject.item.services.ItemService;
import com.aaa_battery.aaa_batteryproject.item.services.ItemDescriptionService;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.ItemDescriptionEntity;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.BookDescription;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.DVDDescription;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.AudiobookDescription;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/librarian")
public class ItemController {

    private final ItemService itemService;
    private final ItemDescriptionService itemDescriptionService; // Service to handle description

    @Autowired
    public ItemController(ItemService itemService, ItemDescriptionService itemDescriptionService) {
        this.itemService = itemService;
        this.itemDescriptionService = itemDescriptionService;
    }

    @PostMapping("/add-item")
    public ResponseEntity<String> addItem(@RequestBody Map<String, Object> requestData) {
        try {
            // Extract values from the request map
            String itemName = (String) requestData.get("itemName");
            String type = ((String) requestData.get("type")).toLowerCase();
            
            // Get the total copies to create
            int totalCopies = 1; // Default to 1 if not specified
            if (requestData.get("totalCopies") != null) {
                try {
                    totalCopies = Integer.parseInt(requestData.get("totalCopies").toString());
                    if (totalCopies < 1) totalCopies = 1; // Ensure at least one copy
                } catch (NumberFormatException e) {

                    // If parsing fails, default to 1 copy
                    totalCopies = 1;
                }
            }
            
            // Check if description already exists
            ItemDescriptionEntity existingDescription = itemDescriptionService.findByNameAndType(itemName, type);

            ItemDescriptionEntity description;
            if (existingDescription != null)
            {
                description = existingDescription;
            }
            else
            {
                // Create a new description based on the type
                description = ItemDescriptionEntity.createDescription(requestData);
                itemDescriptionService.saveDescription(description); // Save to DB
            }

            // Create multiple items based on totalCopies
            for (int i = 0; i < totalCopies; i++) {
                // Create item and set properties
                ItemEntity item = new ItemEntity();
                item.setAvailability(true); // Default availability is true
                item.setDescription(description);

                // Save item in the database
                itemService.addItem(item);
            }

            return ResponseEntity.ok(totalCopies + " copies of the item added successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to add item: " + e.getMessage());
        }
    }
}

