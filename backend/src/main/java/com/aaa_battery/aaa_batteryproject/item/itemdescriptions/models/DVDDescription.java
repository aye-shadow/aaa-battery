package com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models;

import java.time.Duration;

import jakarta.persistence.*;

@Entity
@Table(name = "dvd_description")
@PrimaryKeyJoinColumn(name = "description_id")
public class DVDDescription extends ItemDescriptionEntity {

    private String producer;
    private String director;
    private Duration duration;

    public String getproducer() {
        return producer;
    }

    public void setProducer(String producer) {
        this.producer = producer;
    }

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
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
