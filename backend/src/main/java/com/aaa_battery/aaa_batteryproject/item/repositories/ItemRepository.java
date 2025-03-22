package com.aaa_battery.aaa_batteryproject.item.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aaa_battery.aaa_batteryproject.item.model.ItemEntity;
import org.springframework.stereotype.Repository;

public interface ItemRepository extends JpaRepository<ItemEntity, Long>
{
}
