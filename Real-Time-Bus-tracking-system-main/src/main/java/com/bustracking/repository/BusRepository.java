package com.bustracking.repository;

import com.bustracking.model.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
    List<Bus> findBySourceIgnoreCase(String source);
    List<Bus> findByDestinationIgnoreCase(String destination);
    List<Bus> findBySourceIgnoreCaseAndDestinationIgnoreCase(String source, String destination);
    List<Bus> findByRouteNameContainingIgnoreCase(String routeName);
    List<Bus> findByStatus(String status);
}
