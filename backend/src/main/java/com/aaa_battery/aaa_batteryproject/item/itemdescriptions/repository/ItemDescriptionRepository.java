package com.aaa_battery.aaa_batteryproject.item.itemdescriptions.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.ItemDescriptionEntity;
import com.aaa_battery.aaa_batteryproject.item.model.ItemType;

public interface ItemDescriptionRepository extends JpaRepository<ItemDescriptionEntity, Integer> {
    ItemDescriptionEntity findByItemNameAndItemType(String itemName, ItemType itemType);
}
