package com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models;

import jakarta.persistence.*;
@Entity
@Table(name = "book_description")
@PrimaryKeyJoinColumn(name = "description_id")
public class BookDescription extends ItemDescriptionEntity {

    private String authorName;
    private String publisher;
    
    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }
}
