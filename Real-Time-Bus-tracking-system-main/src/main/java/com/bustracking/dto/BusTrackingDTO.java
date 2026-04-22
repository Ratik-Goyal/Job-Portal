package com.bustracking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BusTrackingDTO {
    private Long id;
    private String busNumber;
    private String routeName;
    private String source;
    private String destination;
    private Double latitude;
    private Double longitude;
    private Integer availableSeats;
    private String status;
    private String busOperator;
    private Integer totalSeats;
    private String waypoints; // JSON array of waypoints
    private String routeColor; // Hex color for route display
    private Integer currentWaypointIndex; // Current waypoint being targeted
}
