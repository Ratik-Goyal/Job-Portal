package com.bustracking.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "routes")
public class Route {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String routeName;
    
    @Column(nullable = false)
    private String source;
    
    @Column(nullable = false)
    private String destination;
    
    // Waypoints as JSON array: [[lat1,lng1], [lat2,lng2], ...]
    @Column(columnDefinition = "TEXT")
    private String waypoints;
    
    // Route color for display on map (hex color)
    @Column(nullable = false)
    private String routeColor; // e.g., #FF6B6B, #4ECDC4, #45B7D1
    
    @Column(nullable = false)
    private String description; // e.g., "Via Shivajinagar, Kothrud, Katraj"
    
    private Integer approximateDistance; // in km
    
    private Integer approximateDuration; // in minutes
}
