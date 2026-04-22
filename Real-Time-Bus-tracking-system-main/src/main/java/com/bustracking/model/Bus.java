package com.bustracking.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "buses")
public class Bus {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String busNumber;
    
    @Column(nullable = false)
    private String routeName;
    
    @Column(nullable = false)
    private String source;
    
    @Column(nullable = false)
    private String destination;
    
    private Double latitude;
    
    private Double longitude;
    
    private Integer totalSeats;
    
    private Integer availableSeats;
    
    private String status; // ACTIVE, INACTIVE, DELAYED
    
    private String busOperator;
    
    @ManyToOne
    @JoinColumn(name = "route_id")
    private Route route;
    
    // Track current waypoint index for route following
    private Integer currentWaypointIndex = 0;
}
