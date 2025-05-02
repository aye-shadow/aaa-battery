package com.aaa_battery.aaa_batteryproject.item.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.aaa_battery.aaa_batteryproject.item.model.ItemEntity;
import com.aaa_battery.aaa_batteryproject.item.model.ItemType;
import com.aaa_battery.aaa_batteryproject.item.service.ItemService;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.AudiobookDescription;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.BookDescription;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.DVDDescription;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.ItemDescriptionEntity;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.service.ItemDescriptionService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/items/")
public class ItemController {

    private final ItemService itemService;
    private final ItemDescriptionService itemDescriptionService; // Service to handle description

    @Autowired
    public ItemController(ItemService itemService, ItemDescriptionService itemDescriptionService) {
        this.itemService = itemService;
        this.itemDescriptionService = itemDescriptionService;
    }

    @PostMapping("/librarian/add-item")
    public ResponseEntity<String> addItem(@RequestBody Map<String, Object> requestData) {
        try {
            // Required inputs:
            // Common: itemName (String), type (String: "book", "audiobook", "dvd"), genre (String), blurb (String), date (String: ISO format), totalCopies (Integer), imageUrl (String)
            // Book: authorName (String), publisher (String)
            // Audiobook: authorName (String), publisher (String), narrator (String), duration (String: "HH:mm:ss")
            // DVD: producer (String), director (String), duration (String: "HH:mm:ss")

            String[] requiredFields = {"itemName", "type", "genre", "blurb", "date", "totalCopies", "imageUrl"};
            for (String field : requiredFields) {
                Object value = requestData.get(field);
                if (value == null || (value instanceof String && ((String) value).trim().isEmpty())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Missing or empty required field: " + field);
                }
            }
            String type = (String) requestData.get("type");
            if (type == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing item type.");
            }
            switch (type.toLowerCase()) {
                case "book" -> {
                    if (requestData.get("authorName") == null || ((String)requestData.get("authorName")).trim().isEmpty()
                        || requestData.get("publisher") == null || ((String)requestData.get("publisher")).trim().isEmpty()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("Missing or empty required field for book: authorName or publisher");
                    }
                }
                case "audiobook" -> {
                    if (requestData.get("authorName") == null || ((String)requestData.get("authorName")).trim().isEmpty()
                        || requestData.get("publisher") == null || ((String)requestData.get("publisher")).trim().isEmpty()
                        || requestData.get("narrator") == null || ((String)requestData.get("narrator")).trim().isEmpty()
                        || requestData.get("duration") == null || ((String)requestData.get("duration")).trim().isEmpty()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("Missing or empty required field for audiobook: authorName, publisher, narrator, or duration");
                    }
                }
                case "dvd" -> {
                    if (requestData.get("producer") == null || ((String)requestData.get("producer")).trim().isEmpty()
                        || requestData.get("director") == null || ((String)requestData.get("director")).trim().isEmpty()
                        || requestData.get("duration") == null || ((String)requestData.get("duration")).trim().isEmpty()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("Missing or empty required field for dvd: producer, director, or duration");
                    }
                }
            }
            
            // Extract values from the request map
            String itemName = (String) requestData.get("itemName");
            Object typeObj = requestData.get("type");
            if (!(typeObj instanceof String) || !ItemType.isValidType((String) typeObj)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid item type provided.");
            }
            ItemType itemType = ItemType.valueOf(((String) typeObj).toUpperCase());
            
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
            ItemDescriptionEntity existingDescription = itemDescriptionService.findByNameAndItemType(itemName, itemType);

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

    @GetMapping("/users/view-items")
    public ResponseEntity<List<Map<String, Object>>> viewItems() {
        try {
            List<ItemEntity> items = itemService.getAllItems();
            
            if (items.isEmpty()) {
                return ResponseEntity.ok(List.of());
            }
            
            // Group items by description ID
            Map<Integer, List<ItemEntity>> groupedItems = items.stream()
                .collect(Collectors.groupingBy(item -> item.getDescription().getDescriptionId()));
            
            // Create one entry per unique description with total and available copies
            List<Map<String, Object>> uniqueItemList = groupedItems.entrySet().stream().map(entry -> {
                Integer descriptionId = entry.getKey();
                List<ItemEntity> itemsWithSameDesc = entry.getValue();
                ItemDescriptionEntity desc = itemsWithSameDesc.get(0).getDescription();
                
                Map<String, Object> itemMap = new HashMap<>();
                
                // Count total copies and available copies
                int totalCopies = itemsWithSameDesc.size();
                int availableCopies = (int) itemsWithSameDesc.stream()
                        .filter(ItemEntity::isAvailability)
                        .count();
                
                itemMap.put("totalCopies", totalCopies);
                itemMap.put("availableCopies", availableCopies);
                
                // Add description info
                if (desc != null) {
                    Map<String, Object> descMap = new HashMap<>();
                    descMap.put("descriptionId", desc.getDescriptionId());
                    descMap.put("itemName", desc.getItemName());
                    descMap.put("type", desc.getItemType());
                    descMap.put("genre", desc.getGenre());
                    descMap.put("blurb", desc.getBlurb());
                    descMap.put("imageUrl", desc.getImageUrl());
                    
                    // Add type-specific fields
                    if (desc instanceof BookDescription) {
                        BookDescription bookDesc = (BookDescription) desc;
                        descMap.put("authorName", bookDesc.getAuthorName());
                        descMap.put("publisher", bookDesc.getPublisher());
                    } else if (desc instanceof DVDDescription) {
                        DVDDescription dvdDesc = (DVDDescription) desc;
                        descMap.put("producer", dvdDesc.getProducer());
                        descMap.put("director", dvdDesc.getDirector());
                        descMap.put("duration", ItemDescriptionEntity.formatDuration(dvdDesc.getDuration()));
                    } else if (desc instanceof AudiobookDescription) {
                        AudiobookDescription audioDesc = (AudiobookDescription) desc;
                        descMap.put("authorName", audioDesc.getAuthorName());
                        descMap.put("publisher", audioDesc.getPublisher());
                        descMap.put("narratorName", audioDesc.getNarratedBy());
                        descMap.put("duration", ItemDescriptionEntity.formatDuration(audioDesc.getDuration()));
                    }
                    
                    itemMap.put("description", descMap);
                }
                
                return itemMap;
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(uniqueItemList);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @GetMapping("/users/view-item")
    public ResponseEntity<List<ItemEntity>> viewItem(@RequestParam Integer descriptionId) {
        try {
            List<ItemEntity> items = itemService.getItemsByDescriptionId(descriptionId);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}

