package com.aaa_battery.aaa_batteryproject.reviews.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.ItemDescriptionEntity;
import com.aaa_battery.aaa_batteryproject.reviews.model.ReviewEntity;
import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {
    
    // Find reviews by item description
    List<ReviewEntity> findByItemDescription(ItemDescriptionEntity itemDescription);
    
    // Find reviews by reviewer (borrower)
    List<ReviewEntity> findByReviewer(BorrowerEntity reviewer);
    
    // Find if a borrower has reviewed a specific item description
    boolean existsByReviewerAndItemDescription(BorrowerEntity reviewer, ItemDescriptionEntity itemDescription);
    
    // Get average rating for an item description
    Double findAverageRatingByItemDescriptionDescriptionId(Integer id);

    boolean existsByReviewerIdAndItemDescriptionDescriptionId(Integer id, Integer itemDescriptionId);
}