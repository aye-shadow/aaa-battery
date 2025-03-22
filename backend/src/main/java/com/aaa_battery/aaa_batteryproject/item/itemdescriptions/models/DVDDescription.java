package com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models;

import jakarta.persistence.*;

@Entity
@Table(name = "dvd_description")
@PrimaryKeyJoinColumn(name = "description_id")
public class DVDDescription extends ItemDescriptionEntity {

    private String productionCompany;
    private String description;
}
