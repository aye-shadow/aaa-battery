package com.aaa_battery.aaa_batteryproject.item.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aaa_battery.aaa_batteryproject.item.model.ItemEntity;

public interface ItemRepository extends JpaRepository<ItemEntity, Long>
{
}
