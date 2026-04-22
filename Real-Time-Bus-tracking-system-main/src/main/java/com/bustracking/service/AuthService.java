package com.bustracking.service;

import com.bustracking.dto.LoginResponse;
import com.bustracking.dto.PassengerLoginRequest;
import com.bustracking.model.Passenger;
import com.bustracking.repository.PassengerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private PassengerRepository passengerRepository;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    public LoginResponse login(PassengerLoginRequest loginRequest) {
        Optional<Passenger> passenger = passengerRepository.findByEmail(loginRequest.getEmail());
        
        if (passenger.isEmpty()) {
            return new LoginResponse("Passenger not found", null, null, null, false);
        }
        
        Passenger p = passenger.get();
        if (!p.getPassword().equals(loginRequest.getPassword())) {
            return new LoginResponse("Invalid password", null, null, null, false);
        }
        
        String token = jwtTokenProvider.generateToken(p.getId().toString());
        
        return new LoginResponse(
            "Login successful",
            token,
            p.getId(),
            p.getName(),
            true
        );
    }
    
    public Passenger registerPassenger(Passenger passenger) {
        if (passengerRepository.findByEmail(passenger.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        return passengerRepository.save(passenger);
    }
}
