package com.aaa_battery.aaa_batteryproject.reviews.dto;

public class ReviewUpdateRequestDTO {
    private Integer rating;
    
    private String comment;
    
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
}