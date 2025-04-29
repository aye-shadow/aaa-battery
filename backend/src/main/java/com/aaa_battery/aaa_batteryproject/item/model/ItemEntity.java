package com.aaa_battery.aaa_batteryproject.item.model;

import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.ItemDescriptionEntity;

import jakarta.persistence.*;

@Entity
@Table(name = "aaa_item")
public class ItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int itemId;

    private boolean availability;

    @ManyToOne
    @JoinColumn(name = "description_id", referencedColumnName = "descriptionId", nullable = false, unique = false)
    private ItemDescriptionEntity description;

    public void setItemId(Integer i) {
         itemId= i ;
    }
    public int getItemId() {
        return itemId;
    }

    public boolean isAvailability() {
        return availability;
    }

    public ItemDescriptionEntity getDescription() {
        return description;
    }

    public void setAvailability(boolean b)
    {
        availability = b;
    }

    public void setDescription(ItemDescriptionEntity description)
    {
        this.description = description;
    }


}

