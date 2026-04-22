package com.bustracking.service;

import com.bustracking.model.Bus;
import com.bustracking.model.Route;
import com.bustracking.repository.BusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
public class BusLocationUpdateService {
    
    @Autowired
    private BusRepository busRepository;
    
    private static final double MOVE_SPEED = 0.0015;
    private static final double WAYPOINT_REACH_DISTANCE = 0.008;
    
    @Scheduled(fixedRate = 2000)
    public void updateBusLocations() {
        List<Bus> activeBuses = busRepository.findByStatus("ACTIVE");
        
        for (Bus bus : activeBuses) {
            if (bus.getRoute() == null) continue;
            
            Route route = bus.getRoute();
            List<double[]> waypoints = parseWaypoints(route.getWaypoints());
            
            if (waypoints == null || waypoints.isEmpty()) continue;
            
            if (bus.getCurrentWaypointIndex() == null) {
                bus.setCurrentWaypointIndex(0);
            }
            
            double currentLat = bus.getLatitude();
            double currentLng = bus.getLongitude();
            
            int currentIndex = bus.getCurrentWaypointIndex();
            if (currentIndex >= waypoints.size()) {
                currentIndex = 0;
                bus.setCurrentWaypointIndex(0);
            }
            
            double[] targetWaypoint = waypoints.get(currentIndex);
            double targetLat = targetWaypoint[0];
            double targetLng = targetWaypoint[1];
            
            double distance = calculateDistance(currentLat, currentLng, targetLat, targetLng);
            
            if (distance < WAYPOINT_REACH_DISTANCE) {
                bus.setCurrentWaypointIndex(currentIndex + 1);
                
                if (bus.getCurrentWaypointIndex() >= waypoints.size()) {
                    bus.setCurrentWaypointIndex(0);
                }
                
                int nextIndex = bus.getCurrentWaypointIndex();
                if (nextIndex < waypoints.size()) {
                    double[] nextWaypoint = waypoints.get(nextIndex);
                    targetLat = nextWaypoint[0];
                    targetLng = nextWaypoint[1];
                }
            }
            
            double bearing = calculateBearing(currentLat, currentLng, targetLat, targetLng);
            double[] newPosition = moveInDirection(currentLat, currentLng, bearing, MOVE_SPEED);
            
            bus.setLatitude(newPosition[0]);
            bus.setLongitude(newPosition[1]);
            
            busRepository.save(bus);
        }
    }
    
    private double calculateDistance(double lat1, double lng1, double lat2, double lng2) {
        return Math.sqrt(
            Math.pow(lat2 - lat1, 2) + 
            Math.pow(lng2 - lng1, 2)
        );
    }
    
    private double calculateBearing(double lat1, double lng1, double lat2, double lng2) {
        return Math.atan2(lng2 - lng1, lat2 - lat1);
    }
    
    private double[] moveInDirection(double lat, double lng, double bearing, double distance) {
        double newLat = lat + distance * Math.cos(bearing);
        double newLng = lng + distance * Math.sin(bearing);
        return new double[]{newLat, newLng};
    }
    
    private List<double[]> parseWaypoints(String waypointsJson) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(waypointsJson, new TypeReference<List<List<Double>>>() {})
                .stream()
                .map(point -> new double[]{point.get(0), point.get(1)})
                .collect(Collectors.toList());
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
}
