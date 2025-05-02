package com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.aaa_battery.aaa_batteryproject.item.model.ItemType;
import com.aaa_battery.aaa_batteryproject.reviews.model.ReviewEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "item_description")
@Inheritance(strategy = InheritanceType.JOINED)
public class ItemDescriptionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int descriptionId;

    @Enumerated(EnumType.STRING)  // Store as string (e.g., "BOOK") instead of number (0)
    private ItemType itemType;

    private String itemName;
    private String genre;
    private String blurb;
    private LocalDateTime date;
    private int totalCopies;
    private String imageUrl;

    @OneToMany(mappedBy = "itemDescription", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ReviewEntity> reviews = new ArrayList<>();
    
    public int getDescriptionId() {
        return descriptionId;
    }

    public ItemType getItemType() {
        return itemType;
    }

    public void setItemType(String type) {
        switch (type.toLowerCase()) {
            case "book" -> this.itemType = ItemType.BOOK;
            case "audiobook" -> this.itemType = ItemType.AUDIOBOOK;
            case "dvd" -> this.itemType = ItemType.DVD;
            default -> throw new IllegalArgumentException("Invalid item type: " + type);
        }
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

    public List<ReviewEntity> getReviews() {
        return reviews;
    }
    
    public void setReviews(List<ReviewEntity> reviews) {
        this.reviews = reviews;
    }
    
    public void addReview(ReviewEntity review) {
        reviews.add(review);
        review.setItemDescription(this);
    }
    
    public void removeReview(ReviewEntity review) {
        reviews.remove(review);
        review.setItemDescription(null);
    }
    
    // Add a method to calculate average rating
    public Double getAverageRating() {
        if (reviews.isEmpty()) {
            return 0.0;
        }
        
        return reviews.stream()
            .mapToInt(ReviewEntity::getRating)
            .average()
            .orElse(0.0);
    }

    // Helper method to create description based on type
    public static ItemDescriptionEntity createDescription(Map<String, Object> requestData) {
        System.out.println("createDescription requestData: " + requestData);
        Object typeObj = requestData.get("type");
        String type;
        if (typeObj instanceof String) {
            type = ((String) typeObj).toLowerCase();
        } else if (typeObj instanceof ItemType) {
            type = ((ItemType) typeObj).name().toLowerCase();
        } else {
            throw new IllegalArgumentException("Invalid type for item type: " + typeObj);
        }
        ItemDescriptionEntity description;
    
        switch (type) {
            case "book" -> {
                description = new BookDescription();
                populateBookDetails((BookDescription) description, requestData);
            }
            case "audiobook" -> {
                description = new AudiobookDescription();
                populateAudiobookDetails((AudiobookDescription) description, requestData);
            }
            case "dvd" -> {
                description = new DVDDescription();
                populateDVDDetails((DVDDescription) description, requestData);
            }
            default -> throw new IllegalArgumentException("Invalid item type: " + type);
        }
    
        populateCommonDetails(description, requestData);
        return description;
    }
    
    private static void populateBookDetails(BookDescription description, Map<String, Object> requestData) {
        description.setAuthorName((String) requestData.get("authorName"));
        description.setPublisher((String) requestData.get("publisher"));
    }
    
    private static void populateAudiobookDetails(AudiobookDescription description, Map<String, Object> requestData) {
        description.setAuthorName((String) requestData.get("authorName"));
        description.setPublisher((String) requestData.get("publisher"));
        description.setNarratedBy((String) requestData.get("narrator"));
        description.setDuration(parseDuration((String) requestData.get("duration")));
    }
    
    private static void populateDVDDetails(DVDDescription description, Map<String, Object> requestData) {
        description.setProducer((String) requestData.get("producer"));
        description.setDirector((String) requestData.get("director"));
        description.setDuration(parseDuration((String) requestData.get("duration")));
    }
    
    private static void populateCommonDetails(ItemDescriptionEntity description, Map<String, Object> requestData) {
        description.setItemName((String) requestData.get("itemName"));
        description.setGenre((String) requestData.getOrDefault("genre", ""));
        description.setBlurb((String) requestData.getOrDefault("blurb", ""));
        String dateStr = (String) requestData.get("date");
        if (dateStr != null) {
            description.setDate(LocalDateTime.parse(dateStr));
        }
        Object totalCopiesObj = requestData.get("totalCopies");
        if (totalCopiesObj instanceof Integer) {
            description.setTotalCopies((Integer) totalCopiesObj);
        } else if (totalCopiesObj instanceof String) {
            description.setTotalCopies(Integer.parseInt((String) totalCopiesObj));
        } else {
            description.setTotalCopies(1);
        }
        description.setImageUrl((String) requestData.getOrDefault("imageUrl", ""));
        description.setItemType((String) requestData.get("type"));
    }
    
    public static Duration parseDuration(String durationString) {
        if (durationString == null) {
            return null;
        }
        LocalTime time = LocalTime.parse(durationString, DateTimeFormatter.ofPattern("HH:mm:ss"));
        return Duration.ofHours(time.getHour())
                       .plusMinutes(time.getMinute())
                       .plusSeconds(time.getSecond());
    }
    
    public static String formatDuration(Duration duration) {
        if (duration == null) {
            return null;
        }
        
        long hours = duration.toHours();
        long minutes = duration.toMinutesPart();
        long seconds = duration.toSecondsPart();
        
        return String.format("%02d:%02d:%02d", hours, minutes, seconds);
    }

    public void setDescriptionId(Integer itemDescriptionId) {
        this.descriptionId = itemDescriptionId;
    }
}
