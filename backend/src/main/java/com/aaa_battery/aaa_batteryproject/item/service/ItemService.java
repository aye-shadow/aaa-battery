package com.aaa_battery.aaa_batteryproject.item.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.aaa_battery.aaa_batteryproject.item.model.ItemEntity;
import com.aaa_battery.aaa_batteryproject.item.model.ItemType;
import com.aaa_battery.aaa_batteryproject.item.repository.ItemRepository;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.ItemDescriptionEntity;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.service.ItemDescriptionService;

@Service
public class ItemService {
    private final ItemRepository itemRepository;
    private final ItemDescriptionService itemDescriptionService;

    @Autowired
    public ItemService(ItemRepository itemRepository, ItemDescriptionService itemDescriptionService) {
        this.itemRepository = itemRepository;
        this.itemDescriptionService = itemDescriptionService;
    }

    public ItemEntity findById(Long itemId) {
        return itemRepository.findById(itemId).orElse(null);
    }

    public void addItem(ItemEntity item) {
        itemRepository.save(item);
    }

    public List<ItemEntity> getAllItems() {
        return itemRepository.findAll();
    }

    public Optional<ItemEntity> findAvailableItemByDescription(Long descriptionId) {
        List<ItemEntity> items = itemRepository.findAvailableItemsByDescription(descriptionId);
        return items.isEmpty() ? Optional.empty() : Optional.of(items.get(0)); // Get first item
    }

    public List<ItemEntity> getItemsByDescriptionId(Integer descriptionId) {
        return itemRepository.findByDescriptionDescriptionId(descriptionId);
    }

    public ItemDescriptionEntity addItemFromRequest(Map<String, Object> requestData) {
        String itemName = (String) requestData.get("itemName");
        Object typeObj = requestData.get("type");
        ItemType type;
        if (typeObj instanceof ItemType) {
            type = (ItemType) typeObj;
        } else if (typeObj instanceof String) {
            type = ItemType.valueOf(((String) typeObj).toUpperCase());
        } else {
            throw new IllegalArgumentException("Invalid type for item type: " + typeObj);
        }
        int totalCopies = (int) requestData.getOrDefault("totalCopies", 1);
    
        // Check if description already exists
        ItemDescriptionEntity existingDescription = itemDescriptionService.findByNameAndItemType(itemName, type);
    
        ItemDescriptionEntity description;
        if (existingDescription != null) {
            description = existingDescription;
        } else {
            // Create a new description based on the type
            requestData = new java.util.HashMap<>(requestData);
            requestData.put("type", type.name()); // Ensure type is String for downstream code
            description = ItemDescriptionEntity.createDescription(requestData);
            itemDescriptionService.saveDescription(description); // Save to DB
        }
    
        // Create multiple items based on totalCopies
        for (int i = 0; i < totalCopies; i++) {
            ItemEntity item = new ItemEntity();
            item.setAvailability(true); // Default availability is true
            item.setDescription(description);
            itemRepository.save(item); // Save item in the database
        }
    
        return description;
    }
}
