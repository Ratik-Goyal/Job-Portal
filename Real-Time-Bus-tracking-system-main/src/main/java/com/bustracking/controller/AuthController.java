package com.bustracking.controller;

import com.bustracking.dto.LoginResponse;
import com.bustracking.dto.PassengerLoginRequest;
import com.bustracking.dto.RegistrationResponse;
import com.bustracking.model.Passenger;
import com.bustracking.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody PassengerLoginRequest loginRequest) {
        try {
            LoginResponse response = authService.login(loginRequest);
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new LoginResponse("Login failed: " + e.getMessage(), null, null, null, false));
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<RegistrationResponse> register(@RequestBody Passenger passenger) {
        try {
            Passenger registeredPassenger = authService.registerPassenger(passenger);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new RegistrationResponse(
                        "Passenger registered successfully with id: " + registeredPassenger.getId(),
                        registeredPassenger.getId(),
                        true
                    ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new RegistrationResponse(
                        "Registration failed: " + e.getMessage(),
                        null,
                        false
                    ));
        }
    }
}
