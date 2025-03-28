package com.aaa_battery.aaa_batteryproject.item.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import com.aaa_battery.aaa_batteryproject.item.model.ItemEntity;

import java.util.Optional;

public interface ItemRepository extends JpaRepository<ItemEntity, Long>
{
    @Query("SELECT i FROM ItemEntity i WHERE i.description.id = :descriptionId AND i.availability = true ORDER BY i.itemId ASC")
    List<ItemEntity> findAvailableItemsByDescription(@Param("descriptionId") Long descriptionId);

}

