package com.aaa_battery.aaa_batteryproject.item.dtos;

import java.time.LocalDateTime;

public class ItemRequest 
{
    private String itemName;
    private String genre;
    private String blurb;
    private LocalDateTime date;
    private int totalCopies;
    private String imageUrl;
    private String type; // "book", "dvd", or "audiobook"

    // Book-specific fields
    private String authorName;
    private String publisher;

    // DVD-specific fields
    private String productionCompany;
    private String dvdDescription;

    // Audiobook-specific fields
    private String narratedBy;

    // Getters and Setters
}
