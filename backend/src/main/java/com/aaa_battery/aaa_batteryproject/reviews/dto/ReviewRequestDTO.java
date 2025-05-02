package com.aaa_battery.aaa_batteryproject.reviews.dto;

public class ReviewRequestDTO {
    
    private Integer borrowId;
    
    private Integer rating;
    
    private String comment;

    private Integer itemId;
    
    // Getters and setters
    public Integer getBorrowId() {
        return borrowId;
    }
    
    public void setBorrowId(Integer borrowId) {
        this.borrowId = borrowId;
    }
    
    public Integer getRating() {
        return rating;
    }
    
    public void setRating(Integer rating) {
        this.rating = rating;
    }
    
    public String getComment() {
        return comment;
    }
    
    public void setComment(String comment) {
        this.comment = comment;
    }

    public void setItemId(Integer itemId) {
        this.itemId = itemId;
    }

    public Integer getItemId() {
        return this.itemId;
    }
}