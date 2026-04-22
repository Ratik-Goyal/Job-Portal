package com.bustracking.service;

import com.bustracking.dto.BusTrackingDTO;
import com.bustracking.model.Bus;
import com.bustracking.repository.BusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BusTrackingService {
    
    @Autowired
    private BusRepository busRepository;
    
    public List<BusTrackingDTO> searchBusesByRoute(String source, String destination) {
        List<Bus> buses = busRepository.findBySourceIgnoreCaseAndDestinationIgnoreCase(source, destination);
        return buses.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public BusTrackingDTO getBusLocation(Long busId) {
        Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> new RuntimeException("Bus not found with id: " + busId));
        return convertToDTO(bus);
    }
    
    public List<BusTrackingDTO> getAllActiveBuses() {
        List<Bus> buses = busRepository.findAll();
        return buses.stream()
                .filter(bus -> "ACTIVE".equals(bus.getStatus()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public BusTrackingDTO updateBusLocation(Long busId, Double latitude, Double longitude) {
        Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> new RuntimeException("Bus not found with id: " + busId));
        
        bus.setLatitude(latitude);
        bus.setLongitude(longitude);
        Bus updatedBus = busRepository.save(bus);
        return convertToDTO(updatedBus);
    }
    
    private BusTrackingDTO convertToDTO(Bus bus) {
        BusTrackingDTO dto = new BusTrackingDTO(
                bus.getId(),
                bus.getBusNumber(),
                bus.getRouteName(),
                bus.getSource(),
                bus.getDestination(),
                bus.getLatitude(),
                bus.getLongitude(),
                bus.getAvailableSeats(),
                bus.getStatus(),
                bus.getBusOperator(),
                bus.getTotalSeats(),
                null,
                null,
                null
        );
        
        if (bus.getRoute() != null) {
            dto.setWaypoints(bus.getRoute().getWaypoints());
            dto.setRouteColor(bus.getRoute().getRouteColor());
            dto.setCurrentWaypointIndex(bus.getCurrentWaypointIndex());
        }
        
        return dto;
    }
}
