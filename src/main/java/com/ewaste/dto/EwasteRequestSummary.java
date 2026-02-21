package com.ewaste.dto;

import com.ewaste.entity.RequestCondition;
import com.ewaste.entity.RequestStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class EwasteRequestSummary {
    private Long id;
    private String deviceType;
    private String brand;
    private String model;
    private RequestCondition condition;
    private Integer quantity;
    private String pickupAddress;
    private String additionalRemarks;
    private RequestStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
