package com.ewaste.controller;

import com.ewaste.dto.EwasteRequestSummary;
import com.ewaste.service.EwasteRequestService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/requests")
public class EwasteRequestController {

    private final EwasteRequestService requestService;

    public EwasteRequestController(EwasteRequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping
    public EwasteRequestSummary submitRequest(
            Authentication authentication,
            @RequestParam String deviceType,
            @RequestParam String brand,
            @RequestParam String model,
            @RequestParam String condition,
            @RequestParam Integer quantity,
            @RequestParam String pickupAddress,
            @RequestParam(required = false) String additionalRemarks,
            @RequestPart("image") MultipartFile image
    ) {
        return requestService.createRequest(
                authentication.getName(),
                deviceType,
                brand,
                model,
                condition,
                quantity,
                pickupAddress,
                additionalRemarks,
                image
        );
    }

    @GetMapping("/mine")
    public List<EwasteRequestSummary> myRequests(Authentication authentication) {
        return requestService.getMyRequests(authentication.getName());
    }

    @GetMapping("/{id}")
    public EwasteRequestSummary requestById(Authentication authentication, @PathVariable Long id) {
        return requestService.getRequestById(authentication.getName(), id);
    }
}
