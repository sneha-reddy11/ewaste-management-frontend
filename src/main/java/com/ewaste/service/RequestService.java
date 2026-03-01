package com.ewaste.service;

import com.ewaste.dto.RequestDto;
import com.ewaste.entity.Request;
import com.ewaste.repository.RequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RequestService {

    private final RequestRepository repo;

    public RequestService(RequestRepository repo) {
        this.repo = repo;
    }

    public Request submitRequest(RequestDto dto, String email) {

        Request r = new Request();
        r.setDeviceType(dto.deviceType);
        r.setBrandModel(dto.brandModel);
        r.setConditionType(dto.conditionType);
        r.setQuantity(dto.quantity);
        r.setPickupAddress(dto.pickupAddress);
        r.setRemarks(dto.remarks);
        r.setUserEmail(email);

        return repo.save(r);
    }

    public List<Request> getMyRequests(String email) {
        return repo.findByUserEmail(email);
    }

    public Request getById(Long id) {
        return repo.findById(id).orElseThrow();
    }
}
