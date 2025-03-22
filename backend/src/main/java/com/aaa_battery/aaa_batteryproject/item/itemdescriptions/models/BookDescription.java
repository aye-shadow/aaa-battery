package com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models;

import jakarta.persistence.*;
@Entity
@Table(name = "book_description")
@PrimaryKeyJoinColumn(name = "description_id")
public class BookDescription extends ItemDescriptionEntity {

    private String authorName;
    private String publisher;
}
