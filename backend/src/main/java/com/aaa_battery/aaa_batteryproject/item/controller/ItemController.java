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
import com.aaa_battery.aaa_batteryproject.item.dtos.ItemRequest;

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

    @PostMapping("/add_item")
    public ResponseEntity<String> addItem(@RequestBody Map<String, Object> requestData) {
        try {
            // Extract values from the request map
            String itemName = (String) requestData.get("itemName");
            String type = ((String) requestData.get("type")).toLowerCase();
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
                description = createDescription(requestData);
                itemDescriptionService.saveDescription(description); // Save to DB
            }

            // Create item and set properties
            ItemEntity item = new ItemEntity();
            item.setAvailability(true); // Default availability is true
            item.setDescription(description);

            // Save item in the database
            itemService.addItem(item);

            return ResponseEntity.ok("Item added successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to add item: " + e.getMessage());
        }
    }

    // Helper method to create description based on type
    private ItemDescriptionEntity createDescription(Map<String, Object> requestData)
    {
        String type = ((String) requestData.get("type")).toLowerCase();

        ItemDescriptionEntity description;
        switch (type) {
            case "book":
                description = new BookDescription();
                ((BookDescription) description).setAuthorName((String) requestData.get("authorName"));
                ((BookDescription) description).setPublisher((String) requestData.get("publisher"));
                break;
            case "dvd":
                description = new DVDDescription();
                ((DVDDescription) description).setProductionCompany((String) requestData.get("productionCompany"));
                ((DVDDescription) description).setDescription((String) requestData.get("dvdDescription"));
                break;
            case "audiobook":
                description = new AudiobookDescription();
                ((AudiobookDescription) description).setNarratedBy((String) requestData.get("narratedBy"));
                break;
            default:
                throw new IllegalArgumentException("Invalid item type: " + type);
        }

        description.setItemName((String) requestData.get("itemName"));
        description.setGenre((String) requestData.get("genre"));
        description.setBlurb((String) requestData.get("blurb"));
        description.setDate(LocalDateTime.parse((String) requestData.get("date")));
        description.setTotalCopies((Integer) requestData.get("totalCopies"));
        description.setImageUrl((String) requestData.get("imageUrl"));
        description.setType(type);
        return description;
    }
}

