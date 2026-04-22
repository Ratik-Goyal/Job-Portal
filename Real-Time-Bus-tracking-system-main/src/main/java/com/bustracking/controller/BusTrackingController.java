package com.bustracking.controller;

import com.bustracking.dto.BusTrackingDTO;
import com.bustracking.service.BusTrackingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buses")
@CrossOrigin(origins = "*")
public class BusTrackingController {
    
    @Autowired
    private BusTrackingService busTrackingService;
    
    @GetMapping("/search")
    public ResponseEntity<List<BusTrackingDTO>> searchBuses(
            @RequestParam String source,
            @RequestParam String destination) {
        try {
            List<BusTrackingDTO> buses = busTrackingService.searchBusesByRoute(source, destination);
            if (buses.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(buses);
            }
            return ResponseEntity.ok(buses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{busId}/location")
    public ResponseEntity<BusTrackingDTO> getBusLocation(@PathVariable Long busId) {
        try {
            BusTrackingDTO bus = busTrackingService.getBusLocation(busId);
            return ResponseEntity.ok(bus);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<BusTrackingDTO>> getAllActiveBuses() {
        try {
            List<BusTrackingDTO> buses = busTrackingService.getAllActiveBuses();
            return ResponseEntity.ok(buses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/{busId}/update-location")
    public ResponseEntity<BusTrackingDTO> updateBusLocation(
            @PathVariable Long busId,
            @RequestParam Double latitude,
            @RequestParam Double longitude) {
        try {
            BusTrackingDTO updatedBus = busTrackingService.updateBusLocation(busId, latitude, longitude);
            return ResponseEntity.ok(updatedBus);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .build();
        }
    }
}
