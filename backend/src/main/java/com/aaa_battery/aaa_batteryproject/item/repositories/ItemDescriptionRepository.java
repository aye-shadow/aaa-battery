package com.aaa_battery.aaa_batteryproject.item.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.ItemDescriptionEntity;

public interface ItemDescriptionRepository extends JpaRepository<ItemDescriptionEntity, Integer> {
    ItemDescriptionEntity findByItemNameAndType(String itemName, String type);
}
