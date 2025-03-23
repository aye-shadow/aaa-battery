package com.aaa_battery.aaa_batteryproject.requests.dto;

import com.aaa_battery.aaa_batteryproject.requests.model.RequestEntity;
import com.aaa_battery.aaa_batteryproject.user.dtos.UserDTO;

public class RequestResponseDTO {

    private Integer id; // Assuming RequestEntity has an ID field
    private String itemType;
    private String itemName;
    private String itemBy;
    private String notes;
    private RequestEntity.RequestStatus status;
    private UserDTO userDTO;

    public RequestResponseDTO() {
        // Default constructor
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getItemType() {
        return itemType;
    }

    public void setItemType(String itemType) {
        this.itemType = itemType;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getItemBy() {
        return itemBy;
    }

    public void setItemBy(String itemBy) {
        this.itemBy = itemBy;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public RequestEntity.RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestEntity.RequestStatus status) {
        this.status = status;
    }

    public UserDTO getUser() {
        return userDTO;
    }

    public void setUser(UserDTO userDTO) {
        this.userDTO = userDTO;
    }
}