package com.aaa_battery.aaa_batteryproject.item.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.aaa_battery.aaa_batteryproject.item.model.ItemEntity;
import com.aaa_battery.aaa_batteryproject.item.services.ItemService;

@RestController
@RequestMapping("/api/librarian")
public class ItemController {

    private final ItemService itemService;

    @Autowired
    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @PostMapping("/add_item")
    public ResponseEntity<String> addItem(@RequestBody ItemEntity item) {
        try {
            itemService.addItem(item);
            return ResponseEntity.ok("Item added successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to add item: " + e.getMessage());
        }
    }

}
