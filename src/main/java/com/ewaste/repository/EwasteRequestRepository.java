package com.ewaste.repository;

import com.ewaste.entity.EwasteRequest;
import com.ewaste.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EwasteRequestRepository extends JpaRepository<EwasteRequest, Long> {
    List<EwasteRequest> findByUserOrderByCreatedAtDesc(User user);

    Optional<EwasteRequest> findByIdAndUser(Long id, User user);
}
