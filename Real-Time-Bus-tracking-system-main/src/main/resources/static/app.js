const API_BASE_URL = 'http://localhost:8080/api';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        login();
    });
    
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        register();
    });
});

function toggleForms() {
    const loginBox = document.querySelector('.login-box');
    const registerBox = document.getElementById('registerBox');
    const loginForm = document.getElementById('loginForm').parentElement;
    const registerForm = document.getElementById('registerForm').parentElement;
    
    if (registerBox.style.display === 'none') {
        loginBox.style.display = 'none';
        registerBox.style.display = 'block';
        document.getElementById('registerForm').style.display = 'block';
    } else {
        loginBox.style.display = 'block';
        registerBox.style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
    }
}

function checkLoginStatus() {
    const token = localStorage.getItem('token');
    const passengerName = localStorage.getItem('passengerName');
    
    if (token) {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('trackingContainer').style.display = 'block';
        document.getElementById('userName').textContent = `Welcome, ${passengerName}!`;
    } else {
        document.getElementById('loginContainer').style.display = 'flex';
        document.getElementById('trackingContainer').style.display = 'none';
    }
}

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
    
    fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('passengerId', data.passengerId);
            localStorage.setItem('passengerName', data.passengerName);
            checkLoginStatus();
        } else {
            errorDiv.style.display = 'block';
            errorDiv.textContent = data.message || 'Login failed. Please try again.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        errorDiv.style.display = 'block';
        errorDiv.textContent = 'Connection error. Please check if the server is running.';
    });
}

function register() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const phone = document.getElementById('regPhone').value;
    const city = document.getElementById('regCity').value;
    
    const errorDiv = document.getElementById('registerError');
    const successDiv = document.getElementById('registerSuccess');
    
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    errorDiv.textContent = '';
    successDiv.textContent = '';
    
    fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone, city })
    })
    .then(response => response.json().then(data => ({ status: response.status, data })))
    .then(({status, data}) => {
        if (status === 201) {
            successDiv.style.display = 'block';
            successDiv.textContent = 'Registration successful! Please login with your credentials.';
            document.getElementById('registerForm').reset();
            setTimeout(() => toggleForms(), 2000);
        } else {
            errorDiv.style.display = 'block';
            errorDiv.textContent = data || 'Registration failed. Please try again.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        errorDiv.style.display = 'block';
        errorDiv.textContent = 'Connection error. Please check if the server is running.';
    });
}

function searchBuses() {
    const source = document.getElementById('source').value.trim();
    const destination = document.getElementById('destination').value.trim();
    
    if (!source || !destination) {
        alert('Please enter both source and destination');
        return;
    }
    
    const token = localStorage.getItem('token');
    
    fetch(`${API_BASE_URL}/buses/search?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        displayBuses(data, 'busList');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error searching buses. Please try again.');
    });
}

function loadActiveBuses() {
    const token = localStorage.getItem('token');
    
    fetch(`${API_BASE_URL}/buses/active`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        displayBuses(data, 'activeBusList');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error loading active buses. Please try again.');
    });
}

function displayBuses(buses, containerId) {
    const container = document.getElementById(containerId);
    
    if (!buses || buses.length === 0) {
        container.innerHTML = '<div class="no-buses">No buses found</div>';
        return;
    }
    
    container.innerHTML = '';
    
    buses.forEach(bus => {
        const busCard = document.createElement('div');
        busCard.className = 'bus-card';
        busCard.innerHTML = `
            <h4>${bus.busNumber}</h4>
            <p class="bus-route">${bus.source} → ${bus.destination}</p>
            <p><strong>Route:</strong> ${bus.routeName}</p>
            <p><strong>Operator:</strong> ${bus.busOperator}</p>
            <p><strong>Available Seats:</strong> ${bus.availableSeats}/${bus.totalSeats}</p>
            <p><strong>Location:</strong> Lat: ${bus.latitude.toFixed(4)}, Long: ${bus.longitude.toFixed(4)}</p>
            <p><strong>Status:</strong> <span class="bus-status ${bus.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}">
                ${bus.status}
            </span></p>
            <button onclick="trackBusOnMap(${bus.id}, '${bus.busNumber}')" class="btn-track" style="width: 100%; padding: 8px; margin-top: 10px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">📍 Track on Map</button>
        `;
        container.appendChild(busCard);
    });
}

// Map variables
let busMap = null;
let busMarkers = {};
let autoRefreshInterval = null;
let isAutoRefreshOn = false;
let selectedBusTrackingInterval = null;
let selectedBusId = null;

// Initialize map
function initializeMap() {
    if (busMap === null) {
        // Center on India (average)
        busMap = L.map('busMap').setView([20.5937, 78.9629], 5);
        
        // Add map tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
        }).addTo(busMap);
    }
}

// Show all buses on map
function showAllBusesOnMap() {
    initializeMap();
    
    const token = localStorage.getItem('token');
    const mapInfo = document.getElementById('mapInfo');
    
    mapInfo.textContent = 'Loading buses...';
    mapInfo.className = 'map-info';
    
    fetch(`${API_BASE_URL}/buses/active`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        clearMapMarkers();
        
        if (!data || data.length === 0) {
            mapInfo.textContent = 'No active buses found to display on map';
            mapInfo.className = 'map-info error';
            return;
        }
        
        // Add markers for each bus
        data.forEach(bus => {
            if (bus.latitude && bus.longitude) {
                const marker = L.marker([bus.latitude, bus.longitude], {
                    title: bus.busNumber,
                    icon: createBusIcon(bus.status)
                }).addTo(busMap);
                
                // Create popup with bus info
                const popupContent = `
                    <div style="font-size: 12px;">
                        <strong>${bus.busNumber}</strong><br>
                        <strong>Route:</strong> ${bus.source} → ${bus.destination}<br>
                        <strong>Status:</strong> ${bus.status}<br>
                        <strong>Seats:</strong> ${bus.availableSeats}/${bus.totalSeats}<br>
                        <strong>Operator:</strong> ${bus.busOperator}<br>
                        <small>Lat: ${bus.latitude.toFixed(4)}<br>Lng: ${bus.longitude.toFixed(4)}</small>
                    </div>
                `;
                marker.bindPopup(popupContent);
                
                busMarkers[bus.id] = { marker, bus };
            }
        });
        
        mapInfo.textContent = `✓ Displaying ${data.length} active buses on map. Click markers for details.`;
        mapInfo.className = 'map-info success';
        
        // Fit map bounds
        if (data.length > 0) {
            const bounds = L.latLngBounds(data.map(bus => [bus.latitude, bus.longitude]));
            busMap.fitBounds(bounds, { padding: [50, 50] });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mapInfo.textContent = '✗ Error loading buses. Please try again.';
        mapInfo.className = 'map-info error';
    });
}

// Create custom bus icon
function createBusIcon(status) {
    const color = status === 'ACTIVE' ? '#27ae60' : '#e74c3c';
    const delayColor = status === 'DELAYED' ? '#f39c12' : color;
    
    return L.divIcon({
        className: 'custom-bus-icon',
        html: `
            <div style="
                background: ${delayColor};
                width: 30px;
                height: 30px;
                border-radius: 50%;
                border: 2px solid white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            ">🚌</div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
    });
}

// Clear all markers from map
function clearMapMarkers() {
    Object.values(busMarkers).forEach(({ marker }) => {
        busMap.removeLayer(marker);
    });
    busMarkers = {};
}

// Auto-refresh map
function autoRefreshMap() {
    const btn = document.getElementById('autoRefreshBtn');
    
    if (isAutoRefreshOn) {
        // Turn off
        isAutoRefreshOn = false;
        btn.textContent = 'Auto-Refresh: OFF';
        btn.classList.remove('active');
        if (autoRefreshInterval) {
            clearInterval(autoRefreshInterval);
        }
    } else {
        // Turn on
        isAutoRefreshOn = true;
        btn.textContent = 'Auto-Refresh: ON';
        btn.classList.add('active');
        
        // Initial refresh
        showAllBusesOnMap();
        
        // Refresh every 5 seconds
        autoRefreshInterval = setInterval(() => {
            showAllBusesOnMap();
        }, 5000);
    }
}

// Track a specific bus on the map
function trackBusOnMap(busId, busNumber) {
    initializeMap();
    
    // Scroll to map section
    const mapSection = document.getElementById('mapSection');
    if (mapSection) {
        mapSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    const token = localStorage.getItem('token');
    const mapInfo = document.getElementById('mapInfo');
    
    // Stop previous tracking
    if (selectedBusTrackingInterval) {
        clearInterval(selectedBusTrackingInterval);
    }
    
    selectedBusId = busId;
    mapInfo.textContent = `Loading bus ${busNumber} for tracking...`;
    mapInfo.className = 'map-info';
    
    // Destination coordinates mapping
    const DESTINATION_COORDS = {
        'Mumbai': [19.0760, 72.8777],
        'Pune': [18.5204, 73.8567],
        'Delhi': [28.7041, 77.1025],
        'Agra': [27.1767, 78.0081],
        'Bangalore': [12.9716, 77.5946],
        'Hyderabad': [17.3850, 78.4867],
        'Chennai': [13.0827, 80.2707],
        'Ahmedabad': [23.0225, 72.5714],
        'Surat': [21.1458, 72.8340],
        'Kochi': [9.9312, 76.2673],
        'Trivandrum': [8.5241, 76.9366],
        'Jaipur': [26.9124, 75.7873],
        'Udaipur': [24.5854, 73.7125],
        'Lucknow': [26.8467, 80.9462],
        'Kanpur': [26.4499, 80.3319],
        'Patna': [25.5941, 85.1376],
        'Gaya': [24.7966, 84.9993],
        'Vijayawada': [16.5062, 80.6480],
        'Indore': [22.7196, 75.8577],
        'Bhopal': [23.1815, 79.9864],
        'Kolkata': [22.5726, 88.3639],
        'Darjeeling': [27.0395, 88.2706],
        'Chandigarh': [30.7333, 76.7794],
        'Amritsar': [31.6340, 74.8723],
        'Gurgaon': [28.4595, 77.0266],
        'Goa': [15.2993, 73.8243],
        'Belgaum': [15.8497, 74.5041]
    };
    
    let previousLocation = null;
    let routePolyline = null;
    let routeWaypoints = [];
    let routeColor = '#3498db'; // Default color
    let routeInitialized = false;
    
    // Function to calculate distance between two points (Haversine formula)
    function calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
    
    // Function to update bus position with real-time tracking UI
    const updateBusPosition = () => {
        fetch(`${API_BASE_URL}/buses/${selectedBusId}/location`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(bus => {
            if (bus && bus.latitude && bus.longitude) {
                clearMapMarkers();
                
                // Parse route waypoints on first load
                if (!routeInitialized && bus.waypoints) {
                    try {
                        routeWaypoints = JSON.parse(bus.waypoints);
                        routeColor = bus.routeColor || '#3498db';
                        routeInitialized = true;
                    } catch (e) {
                        console.error('Error parsing waypoints:', e);
                        routeWaypoints = [];
                    }
                }
                
                // Get destination coordinates
                const destCoords = DESTINATION_COORDS[bus.destination] || [20.5937, 78.9629];
                const sourceCoords = DESTINATION_COORDS[bus.source] || [19.0760, 72.8777];
                
                // Calculate distances
                const distanceToDestination = calculateDistance(
                    bus.latitude, bus.longitude, 
                    destCoords[0], destCoords[1]
                );
                
                const totalDistance = calculateDistance(
                    sourceCoords[0], sourceCoords[1],
                    destCoords[0], destCoords[1]
                );
                
                const distanceCovered = totalDistance - distanceToDestination;
                const progressPercentage = Math.round((distanceCovered / totalDistance) * 100);
                
                // Calculate speed and ETA
                let speed = 60; // Average speed 60 km/h
                const etaMinutes = Math.round((distanceToDestination / speed) * 60);
                const etaHours = Math.floor(etaMinutes / 60);
                const etaMins = etaMinutes % 60;
                
                // Draw colored route polyline with waypoints (only once)
                if (!routePolyline) {
                    if (routeWaypoints.length > 0) {
                        // Use waypoints for the route
                        routePolyline = L.polyline(
                            routeWaypoints.map(point => [point[0], point[1]]),
                            { 
                                color: routeColor, 
                                weight: 4, 
                                opacity: 0.8,
                                lineCap: 'round',
                                lineJoin: 'round'
                            }
                        ).addTo(busMap);
                        
                        // Add waypoint markers as landmarks
                        routeWaypoints.forEach((point, idx) => {
                            if (idx > 0 && idx < routeWaypoints.length - 1) {
                                L.marker([point[0], point[1]], {
                                    icon: L.divIcon({
                                        className: 'landmark-marker',
                                        html: `<div style="background: ${routeColor}80; width: 10px; height: 10px; border-radius: 50%; border: 2px solid ${routeColor}; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
                                        iconSize: [10, 10],
                                        iconAnchor: [5, 5]
                                    })
                                }).addTo(busMap);
                            }
                        });
                    } else {
                        // Fallback to simple line if no waypoints
                        routePolyline = L.polyline(
                            [[sourceCoords[0], sourceCoords[1]], [destCoords[0], destCoords[1]]],
                            { 
                                color: routeColor, 
                                weight: 4, 
                                opacity: 0.8,
                                dashArray: '5, 5'
                            }
                        ).addTo(busMap);
                    }
                }
                
                // Add source marker
                L.marker(sourceCoords, {
                    icon: L.divIcon({
                        className: 'source-marker',
                        html: `<div style="background: #27ae60; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                    })
                }).bindPopup(`<strong>${bus.source}</strong> (START)`).addTo(busMap);
                
                // Add destination marker
                L.marker(destCoords, {
                    icon: L.divIcon({
                        className: 'dest-marker',
                        html: `<div style="background: #e74c3c; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                    })
                }).bindPopup(`<strong>${bus.destination}</strong> (DESTINATION)`).addTo(busMap);
                
                // Create animated bus marker
                const trackedMarker = L.marker([bus.latitude, bus.longitude], {
                    title: bus.busNumber,
                    icon: L.divIcon({
                        className: 'tracked-bus-icon',
                        html: `
                            <div style="
                                background: linear-gradient(135deg, #f39c12 0%, #e74c3c 100%);
                                width: 50px;
                                height: 50px;
                                border-radius: 50%;
                                border: 3px solid white;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 24px;
                                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                                animation: pulse 2s infinite;
                            ">🚌</div>
                        `,
                        iconSize: [50, 50],
                        iconAnchor: [25, 25],
                        popupAnchor: [0, -30]
                    })
                }).addTo(busMap);
                
                // Enhanced popup with real-time info
                const popupContent = `
                    <div style="font-size: 12px; min-width: 200px;">
                        <div style="background: #e74c3c; color: white; padding: 8px; border-radius: 4px 4px 0 0; font-weight: bold; text-align: center;">
                            🚌 ${bus.busNumber} - LIVE TRACKING
                        </div>
                        <div style="padding: 10px; background: #f8f9fa;">
                            <p style="margin: 5px 0;"><strong>Route:</strong> ${bus.source} → ${bus.destination}</p>
                            <p style="margin: 5px 0;"><strong>Progress:</strong> ${progressPercentage}%</p>
                            <div style="background: #e0e0e0; height: 6px; border-radius: 3px; margin: 8px 0; overflow: hidden;">
                                <div style="background: linear-gradient(90deg, #27ae60, #f39c12); height: 100%; width: ${progressPercentage}%; transition: width 0.3s;"></div>
                            </div>
                            <p style="margin: 5px 0;"><strong>Distance Remaining:</strong> ${distanceToDestination.toFixed(1)} km</p>
                            <p style="margin: 5px 0;"><strong>ETA:</strong> ${etaHours}h ${etaMins}m</p>
                            <p style="margin: 5px 0;"><strong>Available Seats:</strong> ${bus.availableSeats}/${bus.totalSeats}</p>
                            <p style="margin: 5px 0;"><strong>Operator:</strong> ${bus.busOperator}</p>
                            <p style="margin: 5px 0; font-size: 11px; color: #666;">📍 ${bus.latitude.toFixed(4)}, ${bus.longitude.toFixed(4)}</p>
                        </div>
                    </div>
                `;
                trackedMarker.bindPopup(popupContent).openPopup();
                
                // Center map on bus
                busMap.setView([bus.latitude, bus.longitude], 12);
                
                busMarkers[bus.id] = { marker: trackedMarker, bus };
                
                // Update map info with live stats
                mapInfo.innerHTML = `
                    <div style="padding: 10px; background: linear-gradient(135deg, #27ae60, #2ecc71); color: white; border-radius: 4px; font-weight: bold;">
                        ✓ ${bus.busNumber} - ${progressPercentage}% Complete | Distance: ${distanceToDestination.toFixed(1)}km | ETA: ${etaHours}h ${etaMins}m
                    </div>
                `;
                mapInfo.className = 'map-info success';
                
                previousLocation = { lat: bus.latitude, lng: bus.longitude };
            } else {
                mapInfo.textContent = '✗ Bus location not found';
                mapInfo.className = 'map-info error';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mapInfo.textContent = '✗ Error tracking bus';
            mapInfo.className = 'map-info error';
        });
    };
    
    // Initial update
    updateBusPosition();
    
    // Update every 2 seconds for smooth real-time tracking
    selectedBusTrackingInterval = setInterval(updateBusPosition, 2000);
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('passengerId');
    localStorage.removeItem('passengerName');
    
    // Stop auto-refresh
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    isAutoRefreshOn = false;
    
    // Destroy map
    if (busMap !== null) {
        busMap.remove();
        busMap = null;
        busMarkers = {};
    }
    
    document.getElementById('loginForm').reset();
    document.getElementById('registerForm').reset();
    document.getElementById('loginError').style.display = 'none';
    document.getElementById('registerError').style.display = 'none';
    document.getElementById('registerSuccess').style.display = 'none';
    
    checkLoginStatus();
}

/* ======================== API KEY MANAGEMENT ======================== */

// Generate a new API key
// API Key Management functions have been removed
