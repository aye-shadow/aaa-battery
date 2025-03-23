package com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models;

import java.time.Duration;

import jakarta.persistence.*;

@Entity
@Table(name = "audiobook_description")
@PrimaryKeyJoinColumn(name = "description_id")
public class AudiobookDescription extends ItemDescriptionEntity
{
    private String narratedBy;
    private Duration duration;
    
    // New fields that were previously inherited from BookDescription
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

    public void setNarratedBy(String narratedBy)
    {
        this.narratedBy = narratedBy;
    }

    public String getNarratedBy()
    {
        return narratedBy;
    }

    public void setDuration(Duration duration)
    {
        this.duration = duration;
    }

    public Duration getDuration()
    {
        return duration;
    }
}