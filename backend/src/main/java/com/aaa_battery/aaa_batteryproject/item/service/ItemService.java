package com.aaa_battery.aaa_batteryproject.item.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.aaa_battery.aaa_batteryproject.item.model.ItemEntity;
import com.aaa_battery.aaa_batteryproject.item.repository.ItemRepository;

@Service
public class ItemService {
    private final ItemRepository itemRepository;

    @Autowired
    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
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

}
