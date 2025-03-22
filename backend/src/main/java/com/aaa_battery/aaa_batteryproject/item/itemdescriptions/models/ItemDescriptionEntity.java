package com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models;

import java.time.LocalDateTime;

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
    private String type;

    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getBlurb() {
        return blurb;
    }

    public void setBlurb(String blurb) {
        this.blurb = blurb;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public int getTotalCopies() {
        return totalCopies;
    }

    public void setTotalCopies(int totalCopies) {
        this.totalCopies = totalCopies;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setBookDescription(BookDescription bookDesc)
    {
    }
}
