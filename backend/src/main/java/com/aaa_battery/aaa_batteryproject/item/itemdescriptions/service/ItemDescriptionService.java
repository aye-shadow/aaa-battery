package com.aaa_battery.aaa_batteryproject.item.itemdescriptions.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.ItemDescriptionEntity;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.repository.ItemDescriptionRepository;
import com.aaa_battery.aaa_batteryproject.item.model.ItemType;

@Service
public class ItemDescriptionService {
    
    @Autowired
    private ItemDescriptionRepository itemDescriptionRepository;

    public ItemDescriptionEntity findByNameAndItemType(String name, ItemType itemType) {
        return itemDescriptionRepository.findByItemNameAndItemType(name, itemType);
    }

    public void saveDescription(ItemDescriptionEntity description) {
        itemDescriptionRepository.save(description);
    }
}
