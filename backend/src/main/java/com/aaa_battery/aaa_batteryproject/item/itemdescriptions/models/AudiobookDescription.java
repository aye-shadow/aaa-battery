package com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models;

import jakarta.persistence.*;
@Entity
@Table(name = "audiobook_description")
@PrimaryKeyJoinColumn(name = "description_id")
public class AudiobookDescription extends ItemDescriptionEntity
{
    private String narratedBy;
}
