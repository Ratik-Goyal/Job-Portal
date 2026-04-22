package com.bustracking.config;

import com.bustracking.model.Bus;
import com.bustracking.model.Passenger;
import com.bustracking.model.Route;
import com.bustracking.repository.BusRepository;
import com.bustracking.repository.PassengerRepository;
import com.bustracking.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {
    
    @Autowired
    private PassengerRepository passengerRepository;
    
    @Autowired
    private BusRepository busRepository;
    
    @Autowired
    private RouteRepository routeRepository;
    
    @Override
    public void run(String... args) throws Exception {
        loadPassengers();
        loadRoutes();
        loadBuses();
    }
    
    private void loadPassengers() {
        Passenger p1 = new Passenger();
        p1.setEmail("passenger1@example.com");
        p1.setPassword("password123");
        p1.setName("Rajesh Kumar");
        p1.setPhone("9876543210");
        p1.setCity("Mumbai");
        passengerRepository.save(p1);
        
        Passenger p2 = new Passenger();
        p2.setEmail("passenger2@example.com");
        p2.setPassword("password456");
        p2.setName("Priya Singh");
        p2.setPhone("9876543211");
        p2.setCity("Delhi");
        passengerRepository.save(p2);
    }
    
    private void loadRoutes() {
        // Route 1: Mumbai to Pune via Shivajinagar, Kothrud, Katraj
        Route route1 = new Route();
        route1.setRouteName("Mumbai to Pune Express");
        route1.setSource("Mumbai");
        route1.setDestination("Pune");
        route1.setWaypoints("[[19.0760,72.8777],[19.0595,72.8295],[18.9322,72.8333],[18.7897,73.1450],[18.5204,73.8567]]");
        route1.setRouteColor("#FF6B6B");
        route1.setDescription("Via Shivajinagar, Kothrud, Katraj");
        route1.setApproximateDistance(150);
        route1.setApproximateDuration(240);
        routeRepository.save(route1);
        
        // Route 2: Delhi to Agra via Mathura
        Route route2 = new Route();
        route2.setRouteName("Delhi to Agra Express");
        route2.setSource("Delhi");
        route2.setDestination("Agra");
        route2.setWaypoints("[[28.7041,77.1025],[28.3394,77.7235],[27.7172,77.1025],[27.1767,78.0081]]");
        route2.setRouteColor("#4ECDC4");
        route2.setDescription("Via Mathura, Firozabad");
        route2.setApproximateDistance(210);
        route2.setApproximateDuration(300);
        routeRepository.save(route2);
        
        // Route 3: Bangalore to Hyderabad via Kurnool
        Route route3 = new Route();
        route3.setRouteName("Bangalore to Hyderabad Express");
        route3.setSource("Bangalore");
        route3.setDestination("Hyderabad");
        route3.setWaypoints("[[12.9716,77.5946],[13.3333,78.4194],[14.4167,79.0833],[16.7050,78.6750],[17.3850,78.4867]]");
        route3.setRouteColor("#45B7D1");
        route3.setDescription("Via Kurnool, Nandyal, Tandur");
        route3.setApproximateDistance(580);
        route3.setApproximateDuration(850);
        routeRepository.save(route3);
        
        // Route 4: Chennai to Bangalore
        Route route4 = new Route();
        route4.setRouteName("Chennai to Bangalore Express");
        route4.setSource("Chennai");
        route4.setDestination("Bangalore");
        route4.setWaypoints("[[13.0827,80.2707],[13.1958,79.8711],[12.9716,77.5946]]");
        route4.setRouteColor("#96CEB4");
        route4.setDescription("Via Vellore, Krishnagiri");
        route4.setApproximateDistance(340);
        route4.setApproximateDuration(480);
        routeRepository.save(route4);
        
        // Route 5: Ahmedabad to Surat
        Route route5 = new Route();
        route5.setRouteName("Ahmedabad to Surat Rapid");
        route5.setSource("Ahmedabad");
        route5.setDestination("Surat");
        route5.setWaypoints("[[23.0225,72.5714],[22.8500,72.6300],[22.1000,72.8333],[21.1458,72.1453]]");
        route5.setRouteColor("#FFEAA7");
        route5.setDescription("Via Anand, Nadiad");
        route5.setApproximateDistance(260);
        route5.setApproximateDuration(360);
        routeRepository.save(route5);
        
        // Route 6: Kochi to Trivandrum
        Route route6 = new Route();
        route6.setRouteName("Kochi to Trivandrum Express");
        route6.setSource("Kochi");
        route6.setDestination("Trivandrum");
        route6.setWaypoints("[[9.9312,76.2673],[9.7674,76.4172],[9.5000,76.7500],[8.5241,76.9366]]");
        route6.setRouteColor("#DDA15E");
        route6.setDescription("Via Ernakulathapuram, Pathanamthitta");
        route6.setApproximateDistance(220);
        route6.setApproximateDuration(400);
        routeRepository.save(route6);
        
        // Route 7: Jaipur to Udaipur
        Route route7 = new Route();
        route7.setRouteName("Jaipur to Udaipur Luxury");
        route7.setSource("Jaipur");
        route7.setDestination("Udaipur");
        route7.setWaypoints("[[26.9124,75.7873],[26.2833,75.8261],[25.2108,73.9870],[24.5854,73.7125]]");
        route7.setRouteColor("#BC6C25");
        route7.setDescription("Via Ajmer, Pali");
        route7.setApproximateDistance(410);
        route7.setApproximateDuration(600);
        routeRepository.save(route7);
        
        // Route 8: Lucknow to Kanpur
        Route route8 = new Route();
        route8.setRouteName("Lucknow to Kanpur Express");
        route8.setSource("Lucknow");
        route8.setDestination("Kanpur");
        route8.setWaypoints("[[26.8467,80.9462],[26.7735,80.6500],[26.4499,80.3319]]");
        route8.setRouteColor("#A23B72");
        route8.setDescription("Via Hardoi, Unnao");
        route8.setApproximateDistance(85);
        route8.setApproximateDuration(120);
        routeRepository.save(route8);
        
        // Route 9: Patna to Gaya
        Route route9 = new Route();
        route9.setRouteName("Patna to Gaya Rapid");
        route9.setSource("Patna");
        route9.setDestination("Gaya");
        route9.setWaypoints("[[25.5941,85.1376],[25.3500,84.8500],[24.7911,84.9850]]");
        route9.setRouteColor("#F18F01");
        route9.setDescription("Via Wazirganj");
        route9.setApproximateDistance(105);
        route9.setApproximateDuration(150);
        routeRepository.save(route9);
        
        // Route 10: Hyderabad to Vijayawada
        Route route10 = new Route();
        route10.setRouteName("Hyderabad to Vijayawada Express");
        route10.setSource("Hyderabad");
        route10.setDestination("Vijayawada");
        route10.setWaypoints("[[17.3850,78.4867],[17.3722,78.9100],[16.7226,79.1386],[16.5062,80.6480]]");
        route10.setRouteColor("#C1121F");
        route10.setDescription("Via Miryalguda, Nalgonda");
        route10.setApproximateDistance(285);
        route10.setApproximateDuration(420);
        routeRepository.save(route10);
        
        // Route 11: Indore to Bhopal
        Route route11 = new Route();
        route11.setRouteName("Indore to Bhopal Express");
        route11.setSource("Indore");
        route11.setDestination("Bhopal");
        route11.setWaypoints("[[22.7196,75.8577],[23.0672,75.7392],[23.1815,79.9864]]");
        route11.setRouteColor("#023047");
        route11.setDescription("Via Mhow, Dewas");
        route11.setApproximateDistance(380);
        route11.setApproximateDuration(540);
        routeRepository.save(route11);
        
        // Route 12: Kolkata to Darjeeling
        Route route12 = new Route();
        route12.setRouteName("Kolkata to Darjeeling Mountain Express");
        route12.setSource("Kolkata");
        route12.setDestination("Darjeeling");
        route12.setWaypoints("[[22.5726,88.3639],[24.0000,88.0000],[25.3000,88.2500],[27.0413,88.2663]]");
        route12.setRouteColor("#FB5607");
        route12.setDescription("Via Siliguri, Kurseong (Mountain Route)");
        route12.setApproximateDistance(560);
        route12.setApproximateDuration(840);
        routeRepository.save(route12);
        
        // Route 13: Chandigarh to Amritsar
        Route route13 = new Route();
        route13.setRouteName("Chandigarh to Amritsar Express");
        route13.setSource("Chandigarh");
        route13.setDestination("Amritsar");
        route13.setWaypoints("[[30.7333,76.7794],[30.8500,75.6000],[31.6340,74.8723]]");
        route13.setRouteColor("#FFBE0B");
        route13.setDescription("Via Ludhiana, Jalandhar");
        route13.setApproximateDistance(240);
        route13.setApproximateDuration(360);
        routeRepository.save(route13);
        
        // Route 14: Gurgaon to Chandigarh
        Route route14 = new Route();
        route14.setRouteName("Gurgaon to Chandigarh Rapid");
        route14.setSource("Gurgaon");
        route14.setDestination("Chandigarh");
        route14.setWaypoints("[[28.4595,77.0266],[28.8000,76.7500],[29.8000,76.8000],[30.7333,76.7794]]");
        route14.setRouteColor("#3A86FF");
        route14.setDescription("Via Bahadurgarh, Sonepat");
        route14.setApproximateDistance(270);
        route14.setApproximateDuration(380);
        routeRepository.save(route14);
        
        // Route 15: Goa to Belgaum
        Route route15 = new Route();
        route15.setRouteName("Goa to Belgaum Express");
        route15.setSource("Goa");
        route15.setDestination("Belgaum");
        route15.setWaypoints("[[15.2993,73.8243],[15.4500,74.4500],[15.8604,75.6245]]");
        route15.setRouteColor("#8338EC");
        route15.setDescription("Via Sangli, Bailhongal");
        route15.setApproximateDistance(350);
        route15.setApproximateDuration(500);
        routeRepository.save(route15);
    }
    
    private void loadBuses() {
        // Get routes
        Route route1 = routeRepository.findByRouteNameIgnoreCase("Mumbai to Pune Express").orElse(null);
        Route route2 = routeRepository.findByRouteNameIgnoreCase("Delhi to Agra Express").orElse(null);
        Route route3 = routeRepository.findByRouteNameIgnoreCase("Bangalore to Hyderabad Express").orElse(null);
        Route route4 = routeRepository.findByRouteNameIgnoreCase("Chennai to Bangalore Express").orElse(null);
        Route route5 = routeRepository.findByRouteNameIgnoreCase("Ahmedabad to Surat Rapid").orElse(null);
        Route route6 = routeRepository.findByRouteNameIgnoreCase("Kochi to Trivandrum Express").orElse(null);
        Route route7 = routeRepository.findByRouteNameIgnoreCase("Jaipur to Udaipur Luxury").orElse(null);
        Route route8 = routeRepository.findByRouteNameIgnoreCase("Lucknow to Kanpur Express").orElse(null);
        Route route9 = routeRepository.findByRouteNameIgnoreCase("Patna to Gaya Rapid").orElse(null);
        Route route10 = routeRepository.findByRouteNameIgnoreCase("Hyderabad to Vijayawada Express").orElse(null);
        Route route11 = routeRepository.findByRouteNameIgnoreCase("Indore to Bhopal Express").orElse(null);
        Route route12 = routeRepository.findByRouteNameIgnoreCase("Kolkata to Darjeeling Mountain Express").orElse(null);
        Route route13 = routeRepository.findByRouteNameIgnoreCase("Chandigarh to Amritsar Express").orElse(null);
        Route route14 = routeRepository.findByRouteNameIgnoreCase("Gurgaon to Chandigarh Rapid").orElse(null);
        Route route15 = routeRepository.findByRouteNameIgnoreCase("Goa to Belgaum Express").orElse(null);
        
        Bus bus1 = new Bus();
        bus1.setBusNumber("MH-01-AB-1234");
        bus1.setRouteName("Mumbai to Pune Express");
        bus1.setSource("Mumbai");
        bus1.setDestination("Pune");
        bus1.setLatitude(19.0760);
        bus1.setLongitude(72.8777);
        bus1.setTotalSeats(50);
        bus1.setAvailableSeats(12);
        bus1.setStatus("ACTIVE");
        bus1.setBusOperator("Shivneri Travels");
        bus1.setRoute(route1);
        bus1.setCurrentWaypointIndex(0);
        busRepository.save(bus1);
        
        Bus bus2 = new Bus();
        bus2.setBusNumber("DL-01-BC-5678");
        bus2.setRouteName("Delhi to Agra Express");
        bus2.setSource("Delhi");
        bus2.setDestination("Agra");
        bus2.setLatitude(28.7041);
        bus2.setLongitude(77.1025);
        bus2.setTotalSeats(45);
        bus2.setAvailableSeats(8);
        bus2.setStatus("ACTIVE");
        bus2.setBusOperator("Raj Travels");
        bus2.setRoute(route2);
        bus2.setCurrentWaypointIndex(0);
        busRepository.save(bus2);
        
        Bus bus3 = new Bus();
        bus3.setBusNumber("KA-01-CD-9012");
        bus3.setRouteName("Bangalore to Hyderabad Express");
        bus3.setSource("Bangalore");
        bus3.setDestination("Hyderabad");
        bus3.setLatitude(12.9716);
        bus3.setLongitude(77.5946);
        bus3.setTotalSeats(55);
        bus3.setAvailableSeats(15);
        bus3.setStatus("ACTIVE");
        bus3.setBusOperator("VRL Travels");
        bus3.setRoute(route3);
        bus3.setCurrentWaypointIndex(0);
        busRepository.save(bus3);
        
        Bus bus4 = new Bus();
        bus4.setBusNumber("TN-01-EF-3456");
        bus4.setRouteName("Chennai to Bangalore Express");
        bus4.setSource("Chennai");
        bus4.setDestination("Bangalore");
        bus4.setLatitude(13.0827);
        bus4.setLongitude(80.2707);
        bus4.setTotalSeats(48);
        bus4.setAvailableSeats(5);
        bus4.setStatus("ACTIVE");
        bus4.setBusOperator("SRS Travels");
        bus4.setRoute(route4);
        bus4.setCurrentWaypointIndex(0);
        busRepository.save(bus4);
        
        // Additional buses - more routes across India
        Bus bus5 = new Bus();
        bus5.setBusNumber("GJ-02-GH-7890");
        bus5.setRouteName("Ahmedabad to Surat Rapid");
        bus5.setSource("Ahmedabad");
        bus5.setDestination("Surat");
        bus5.setLatitude(23.0225);
        bus5.setLongitude(72.5714);
        bus5.setTotalSeats(52);
        bus5.setAvailableSeats(18);
        bus5.setStatus("ACTIVE");
        bus5.setBusOperator("Star Travels");
        bus5.setRoute(route5);
        bus5.setCurrentWaypointIndex(0);
        busRepository.save(bus5);
        
        Bus bus6 = new Bus();
        bus6.setBusNumber("KL-03-IJ-2345");
        bus6.setRouteName("Kochi to Trivandrum Express");
        bus6.setSource("Kochi");
        bus6.setDestination("Trivandrum");
        bus6.setLatitude(9.9312);
        bus6.setLongitude(76.2673);
        bus6.setTotalSeats(45);
        bus6.setAvailableSeats(20);
        bus6.setStatus("ACTIVE");
        bus6.setBusOperator("Kerala Express");
        bus6.setRoute(route6);
        bus6.setCurrentWaypointIndex(0);
        busRepository.save(bus6);
        
        Bus bus7 = new Bus();
        bus7.setBusNumber("RJ-04-KL-6789");
        bus7.setRouteName("Jaipur to Udaipur Luxury");
        bus7.setSource("Jaipur");
        bus7.setDestination("Udaipur");
        bus7.setLatitude(26.9124);
        bus7.setLongitude(75.7873);
        bus7.setTotalSeats(42);
        bus7.setAvailableSeats(10);
        bus7.setStatus("ACTIVE");
        bus7.setBusOperator("Pink City Travels");
        bus7.setRoute(route7);
        bus7.setCurrentWaypointIndex(0);
        busRepository.save(bus7);
        
        Bus bus8 = new Bus();
        bus8.setBusNumber("UP-05-MN-3210");
        bus8.setRouteName("Lucknow to Kanpur Express");
        bus8.setSource("Lucknow");
        bus8.setDestination("Kanpur");
        bus8.setLatitude(26.8467);
        bus8.setLongitude(80.9462);
        bus8.setTotalSeats(50);
        bus8.setAvailableSeats(25);
        bus8.setStatus("ACTIVE");
        bus8.setBusOperator("Avadh Express");
        bus8.setRoute(route8);
        bus8.setCurrentWaypointIndex(0);
        busRepository.save(bus8);
        
        Bus bus9 = new Bus();
        bus9.setBusNumber("BR-06-OP-5432");
        bus9.setRouteName("Patna to Gaya Rapid");
        bus9.setSource("Patna");
        bus9.setDestination("Gaya");
        bus9.setLatitude(25.5941);
        bus9.setLongitude(85.1376);
        bus9.setTotalSeats(48);
        bus9.setAvailableSeats(16);
        bus9.setStatus("ACTIVE");
        bus9.setBusOperator("Bihar Express");
        bus9.setRoute(route9);
        bus9.setCurrentWaypointIndex(0);
        busRepository.save(bus9);
        
        Bus bus10 = new Bus();
        bus10.setBusNumber("TG-07-QR-8765");
        bus10.setRouteName("Hyderabad to Vijayawada Express");
        bus10.setSource("Hyderabad");
        bus10.setDestination("Vijayawada");
        bus10.setLatitude(17.3850);
        bus10.setLongitude(78.4867);
        bus10.setTotalSeats(50);
        bus10.setAvailableSeats(14);
        bus10.setStatus("ACTIVE");
        bus10.setBusOperator("Telangana Travels");
        bus10.setRoute(route10);
        bus10.setCurrentWaypointIndex(0);
        busRepository.save(bus10);
        
        Bus bus11 = new Bus();
        bus11.setBusNumber("MP-08-ST-1098");
        bus11.setRouteName("Indore to Bhopal Express");
        bus11.setSource("Indore");
        bus11.setDestination("Bhopal");
        bus11.setLatitude(22.7196);
        bus11.setLongitude(75.8577);
        bus11.setTotalSeats(46);
        bus11.setAvailableSeats(9);
        bus11.setStatus("ACTIVE");
        bus11.setBusOperator("Madhya Express");
        bus11.setRoute(route11);
        bus11.setCurrentWaypointIndex(0);
        busRepository.save(bus11);
        
        Bus bus12 = new Bus();
        bus12.setBusNumber("WB-09-UV-3456");
        bus12.setRouteName("Kolkata to Darjeeling Mountain Express");
        bus12.setSource("Kolkata");
        bus12.setDestination("Darjeeling");
        bus12.setLatitude(22.5726);
        bus12.setLongitude(88.3639);
        bus12.setTotalSeats(40);
        bus12.setAvailableSeats(7);
        bus12.setStatus("ACTIVE");
        bus12.setBusOperator("Bengal Express");
        bus12.setRoute(route12);
        bus12.setCurrentWaypointIndex(0);
        busRepository.save(bus12);
        
        Bus bus13 = new Bus();
        bus13.setBusNumber("PB-10-WX-5678");
        bus13.setRouteName("Chandigarh to Amritsar Express");
        bus13.setSource("Chandigarh");
        bus13.setDestination("Amritsar");
        bus13.setLatitude(30.7333);
        bus13.setLongitude(76.7794);
        bus13.setTotalSeats(48);
        bus13.setAvailableSeats(11);
        bus13.setStatus("ACTIVE");
        bus13.setBusOperator("Punjab Travels");
        bus13.setRoute(route13);
        bus13.setCurrentWaypointIndex(0);
        busRepository.save(bus13);
        
        Bus bus14 = new Bus();
        bus14.setBusNumber("HR-11-YZ-9012");
        bus14.setRouteName("Gurgaon to Chandigarh Rapid");
        bus14.setSource("Gurgaon");
        bus14.setDestination("Chandigarh");
        bus14.setLatitude(28.4595);
        bus14.setLongitude(77.0266);
        bus14.setTotalSeats(52);
        bus14.setAvailableSeats(22);
        bus14.setStatus("ACTIVE");
        bus14.setBusOperator("Haryana Express");
        bus14.setRoute(route14);
        bus14.setCurrentWaypointIndex(0);
        busRepository.save(bus14);
        
        Bus bus15 = new Bus();
        bus15.setBusNumber("MZ-12-AB-3210");
        bus15.setRouteName("Goa to Belgaum Express");
        bus15.setSource("Goa");
        bus15.setDestination("Belgaum");
        bus15.setLatitude(15.2993);
        bus15.setLongitude(73.8243);
        bus15.setTotalSeats(44);
        bus15.setAvailableSeats(13);
        bus15.setStatus("ACTIVE");
        bus15.setBusOperator("Goa Express");
        bus15.setRoute(route15);
        bus15.setCurrentWaypointIndex(0);
        busRepository.save(bus15);
    }
    
}
