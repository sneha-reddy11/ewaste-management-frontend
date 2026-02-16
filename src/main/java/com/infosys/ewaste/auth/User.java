package com.infosys.ewaste.auth;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    private String phone;

    private String address;


    @Column(nullable = false)
    private boolean enabled = false;  

    private String otp;               

    private LocalDateTime otpExpiryTime; 
}
