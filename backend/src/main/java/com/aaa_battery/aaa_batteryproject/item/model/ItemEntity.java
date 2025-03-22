package com.aaa_battery.aaa_batteryproject.item.model;

import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.ItemDescriptionEntity;


import jakarta.persistence.*;

@Entity

@Table(name = "aaa_item")
public class ItemEntity
{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int itemId;

    private boolean availability;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "description_id", referencedColumnName = "descriptionId")
    private ItemDescriptionEntity description;
}

