package com.aaa_battery.aaa_batteryproject.user.model;

import java.util.ArrayList;
import java.util.List;

import com.aaa_battery.aaa_batteryproject.borrows.model.BorrowEntity;
import com.aaa_battery.aaa_batteryproject.fines.model.FineEntity;
import com.aaa_battery.aaa_batteryproject.requests.model.RequestEntity;
import com.aaa_battery.aaa_batteryproject.reviews.model.ReviewEntity;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "borrowers")
@PrimaryKeyJoinColumn(name = "id") // Links to the 'id' column in the 'users' table
public class BorrowerEntity extends UserEntity {

    @OneToMany(mappedBy = "borrower", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<BorrowEntity> borrowedItems = new ArrayList<>();

    @OneToMany(mappedBy = "requestor", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    private List<RequestEntity> requests = new ArrayList<>();
    
    @OneToMany(mappedBy = "reviewer", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    private List<ReviewEntity> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "borrower", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FineEntity> fines = new ArrayList<>();

    public BorrowerEntity() {
    }

    public BorrowerEntity(String fullName, String email, String password) {
        super(fullName, email, password);
    }

    public List<BorrowEntity> getBorrowedItems() {
        return borrowedItems;
    }

    public void setBorrowedItems(List<BorrowEntity> borrowedItems) {
        this.borrowedItems = borrowedItems;
    }

    public List<FineEntity> getFines() {
        return fines;
    }

    public void setFines(List<FineEntity> fines) {
        this.fines = fines;
    }
    
    public void addFine(FineEntity fine) {
        this.fines.add(fine);
        fine.setBorrower(this);  
    }
    
    public void removeFine(FineEntity fine) {
        this.fines.remove(fine);
        fine.setBorrower(null);      
    }


    public void addBorrowedItem(BorrowEntity borrow) {
        borrowedItems.add(borrow);
        borrow.setBorrower(this);
    }

    public void removeBorrowedItem(BorrowEntity borrow) {
        borrowedItems.remove(borrow);
        borrow.setBorrower(null);
    }
    
    public List<ReviewEntity> getReviews() {
        return reviews;
    }
    
    public void setReviews(List<ReviewEntity> reviews) {
        this.reviews = reviews;
    }
    
    public void addReview(ReviewEntity review) {
        reviews.add(review);
        review.setReviewer(this);
    }
    
    public void removeReview(ReviewEntity review) {
        reviews.remove(review);
        review.setReviewer(null);
    }
}