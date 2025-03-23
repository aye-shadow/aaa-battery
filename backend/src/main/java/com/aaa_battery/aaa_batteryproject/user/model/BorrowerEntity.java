package com.aaa_battery.aaa_batteryproject.user.model;

import java.util.ArrayList;
import java.util.List;

import com.aaa_battery.aaa_batteryproject.borrows.model.BorrowEntity;
import com.aaa_battery.aaa_batteryproject.requests.model.RequestEntity;
import com.aaa_battery.aaa_batteryproject.subscription.model.SubscriptionEntity;

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
    private List<BorrowEntity> borrowedItems = new ArrayList<>();

    @OneToMany(mappedBy = "requestor", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<RequestEntity> requests = new ArrayList<>();

    @OneToOne(mappedBy = "borrower", cascade = CascadeType.ALL, orphanRemoval = true)
    private SubscriptionEntity subscription;

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

    public List<RequestEntity> getRequests() {
        return requests;
    }

    public void setRequests(List<RequestEntity> requests) {
        this.requests = requests;
    }

    public SubscriptionEntity getSubscription() {
        return subscription;
    }

    public void setSubscription(SubscriptionEntity subscription) {
        this.subscription = subscription;
    }
}