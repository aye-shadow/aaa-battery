package com.aaa_battery.aaa_batteryproject.item.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.aaa_battery.aaa_batteryproject.item.model.ItemEntity;
import com.aaa_battery.aaa_batteryproject.item.repositories.ItemRepository;

@Service
public class ItemService
{
    private final ItemRepository itemRepository;

    @Autowired
    public ItemService(ItemRepository itemRepository)
    {
        this.itemRepository = itemRepository;
    }

    public ItemEntity addItem(ItemEntity item)
    {
        return itemRepository.save(item);
    }
}
