package com.ewaste.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "requests")
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String deviceType;
    private String brandModel;
    private String conditionType;
    private int quantity;

    private String pickupAddress;

    private String imageUrl;   // store file path

    private String remarks;

    private String status = "Pending";

    private String userEmail; // from JWT

    private LocalDateTime createdAt = LocalDateTime.now();

    /* =========================
       CONSTRUCTOR (REQUIRED)
    ========================= */

    public Request() {}

    /* =========================
       GETTERS
    ========================= */

    public Long getId() {
        return id;
    }

    public String getDeviceType() {
        return deviceType;
    }

    public String getBrandModel() {
        return brandModel;
    }

    public String getConditionType() {
        return conditionType;
    }

    public int getQuantity() {
        return quantity;
    }

    public String getPickupAddress() {
        return pickupAddress;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getRemarks() {
        return remarks;
    }

    public String getStatus() {
        return status;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    /* =========================
       SETTERS
    ========================= */

    public void setDeviceType(String deviceType) {
        this.deviceType = deviceType;
    }

    public void setBrandModel(String brandModel) {
        this.brandModel = brandModel;
    }

    public void setConditionType(String conditionType) {
        this.conditionType = conditionType;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public void setPickupAddress(String pickupAddress) {
        this.pickupAddress = pickupAddress;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }
}
