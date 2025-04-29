package com.aaa_battery.aaa_batteryproject.reviews.model;

import java.util.Date;

import com.aaa_battery.aaa_batteryproject.borrows.model.BorrowEntity;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.ItemDescriptionEntity;
import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "reviews")
public class ReviewEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "borrower_id", nullable = false)
    @JsonIgnore
    private BorrowerEntity reviewer;

    @ManyToOne
    @JoinColumn(name = "item_description_id", nullable = false)
    private ItemDescriptionEntity itemDescription;

    @ManyToOne
    @JoinColumn(name = "borrow_id", nullable = false)
    private BorrowEntity borrow;

    private Integer rating;

    private String comment;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    // Default constructor
    public ReviewEntity() {
        this.createdAt = new Date();
    }

    // Constructor with parameters
    public ReviewEntity(BorrowerEntity reviewer, ItemDescriptionEntity itemDescription, BorrowEntity borrow, 
                       Integer rating, String comment) {
        this.reviewer = reviewer;
        this.itemDescription = itemDescription;
        this.borrow = borrow;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = new Date();
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BorrowerEntity getReviewer() {
        return reviewer;
    }

    public void setReviewer(BorrowerEntity reviewer) {
        this.reviewer = reviewer;
    }

    public ItemDescriptionEntity getItemDescription() {
        return itemDescription;
    }

    public void setItemDescription(ItemDescriptionEntity itemDescription) {
        // If there was a previous item description, recalculate its rating
        if (this.itemDescription != null && this.itemDescription != itemDescription) {
            ItemDescriptionEntity oldDescription = this.itemDescription;
            this.itemDescription = null;
            oldDescription.recalculateAverageRating(0);
        }
        
        this.itemDescription = itemDescription;
        
        // Recalculate the new item description's rating if it exists
        if (itemDescription != null) {
            itemDescription.recalculateAverageRating(0);
        }
    }

    public BorrowEntity getBorrow() {
        return borrow;
    }

    public void setBorrow(BorrowEntity borrow) {
        this.borrow = borrow;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
        // Recalculate the average if the item description is set
        if (this.itemDescription != null) {
            this.itemDescription.recalculateAverageRating(rating);
        }
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
}