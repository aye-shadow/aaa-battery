package com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "item_description")
@Inheritance(strategy = InheritanceType.JOINED)
public class ItemDescriptionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int descriptionId;

    private String itemName;
    private String genre;
    private String blurb;
    private LocalDateTime date;
    private int totalCopies;
    private String imageUrl;
}
