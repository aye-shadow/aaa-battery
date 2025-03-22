package com.aaa_battery.aaa_batteryproject.item.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.ItemDescriptionEntity;
import com.aaa_battery.aaa_batteryproject.item.repositories.ItemDescriptionRepository;

@Service
public class ItemDescriptionService {
    
    @Autowired
    private ItemDescriptionRepository itemDescriptionRepository;

    public ItemDescriptionEntity findByNameAndType(String name, String type) {
        return itemDescriptionRepository.findByItemNameAndType(name, type);
    }

    public void saveDescription(ItemDescriptionEntity description) {
        itemDescriptionRepository.save(description);
    }
}
