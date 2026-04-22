import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import L from 'leaflet';
import './TrackingPage.css';

function TrackingPage({ user, onLogout }) {
  const [buses, setBuses] = useState([]);
  const [activeBuses, setActiveBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('search'); // 'search', 'all', 'map'
  const mapContainer = useRef(null);
  const map = useRef(null);
  const busMarker = useRef(null);
  const routePolyline = useRef(null);
  const updateInterval = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('jwtToken');

  // Fetch active buses on component mount
  useEffect(() => {
    loadActiveBuses();
  }, []);

  // Update selected bus location every 2 seconds
  useEffect(() => {
    if (selectedBus && activeTab === 'map') {
      updateInterval.current = setInterval(() => {
        updateBusLocation(selectedBus.id);
      }, 2000);
    }
    return () => {
      if (updateInterval.current) clearInterval(updateInterval.current);
    };
  }, [selectedBus, activeTab]);

  const loadActiveBuses = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/buses/active', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setActiveBuses(response.data);
    } catch (err) {
      // Silently handle error on initial load
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!source.trim() || !destination.trim()) {
      setError('Please enter both source and destination');
      return;
    }

    setError('');
    setLoading(true);
    setActiveTab('search');

    try {
      const response = await axios.get(
        `http://localhost:8080/api/buses/search?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBuses(response.data);
      if (response.data.length === 0) {
        setError('No buses found for this route');
      }
    } catch (err) {
      setError('Error searching buses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const initializeMap = (bus) => {
    if (map.current) return; // Map already initialized

    map.current = L.map(mapContainer.current).setView(
      [parseFloat(bus.latitude), parseFloat(bus.longitude)],
      12
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current);
  };

  const updateBusLocation = async (busId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/buses/${busId}/location`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const bus = response.data;
      setSelectedBus(bus);

      if (!map.current) {
        initializeMap(bus);
      }

      // Update bus marker
      if (busMarker.current) {
        map.current.removeLayer(busMarker.current);
      }

      busMarker.current = L.circleMarker(
        [parseFloat(bus.latitude), parseFloat(bus.longitude)],
        {
          radius: 10,
          color: bus.routeColor || '#FF6B6B',
          fillColor: bus.routeColor || '#FF6B6B',
          fillOpacity: 0.8,
          weight: 2,
        }
      ).addTo(map.current);

      busMarker.current.bindPopup(`
        <div class="bus-popup">
          <strong>${bus.busNumber}</strong><br/>
          Seats: ${bus.availableSeats}/${bus.totalSeats}
        </div>
      `);

      // Draw route polyline (only once)
      if (!routePolyline.current && bus.waypoints) {
        const waypoints = JSON.parse(bus.waypoints);
        const routeCoordinates = waypoints.map((point) => [point[0], point[1]]);

        routePolyline.current = L.polyline(routeCoordinates, {
          color: bus.routeColor || '#FF6B6B',
          weight: 4,
          opacity: 0.8,
        }).addTo(map.current);

        // Add waypoint markers
        waypoints.forEach((point) => {
          L.circleMarker([point[0], point[1]], {
            radius: 4,
            color: '#666',
            fillOpacity: 0.6,
          }).addTo(map.current);
        });
      }

      // Center map on bus
      map.current.setView([parseFloat(bus.latitude), parseFloat(bus.longitude)], 12);
    } catch (err) {
      console.error('Error updating bus location:', err);
    }// Silently handle location update error
  };

  const handleTrackBus = (bus) => {
    setSelectedBus(bus);
    setBuses([]);
    setSource('');
    setDestination('');
    setActiveTab('map');
    
    // Clear previous map
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    if (busMarker.current) {
      busMarker.current = null;
    }
    if (routePolyline.current) {
      routePolyline.current = null;
    }

    // Initialize new map after a short delay
    setTimeout(() => {
      updateBusLocation(bus.id);
    }, 100);
  };

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="tracking-page">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">Bus Tracker</h1>
          <div className="header-right">
            <span className="user-info">Welcome, {user?.name}</span>
            <button className="btn-logout" onClick={handleLogoutClick}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="tracking-container container-fluid">
        {/* Search Section */}
        <div className="search-section">
          <h2>Search Buses</h2>
          <form onSubmit={handleSearch} className="search-form">
            <div className="form-group">
              <label htmlFor="source">From</label>
              <input
                id="source"
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g., Mumbai"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="destination">To</label>
              <input
                id="destination"
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g., Pune"
                disabled={loading}
              />
            </div>
            <button type="submit" className="btn-search" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {error && <div className="error-message">{error}</div>}
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            Search Results ({buses.length})
          </button>
          <button
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Active Buses ({activeBuses.length})
          </button>
          {selectedBus && (
            <button
              className={`tab ${activeTab === 'map' ? 'active' : ''}`}
              onClick={() => setActiveTab('map')}
            >
              Live Tracking
            </button>
          )}
        </div>

        {/* Content */}
        <div className="tabs-content">
          {/* Search Results Tab */}
          {activeTab === 'search' && (
            <div className="bus-grid">
              {buses.length === 0 && !error && (
                <p className="no-results">No buses to display. Search for buses above.</p>
              )}
              {buses.map((bus) => (
                <div key={bus.id} className="bus-card">
                  <div className="bus-header">
                    <h3>{bus.busNumber}</h3>
                    <span className="bus-status">{bus.status}</span>
                  </div>
                  <div className="bus-details">
                    <p><strong>Route:</strong> {bus.routeName}</p>
                    <p><strong>From:</strong> {bus.source}</p>
                    <p><strong>To:</strong> {bus.destination}</p>
                    <p><strong>Seats:</strong> {bus.availableSeats}/{bus.totalSeats}</p>
                    <p><strong>Operator:</strong> {bus.busOperator}</p>
                  </div>
                  <button
                    className="btn-track"
                    onClick={() => handleTrackBus(bus)}
                  >
                    Track on Map
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Active Buses Tab */}
          {activeTab === 'all' && (
            <div className="bus-grid">
              {activeBuses.map((bus) => (
                <div key={bus.id} className="bus-card">
                  <div className="bus-header">
                    <h3>{bus.busNumber}</h3>
                    <span className="bus-status">{bus.status}</span>
                  </div>
                  <div className="bus-details">
                    <p><strong>Route:</strong> {bus.routeName}</p>
                    <p><strong>From:</strong> {bus.source}</p>
                    <p><strong>To:</strong> {bus.destination}</p>
                    <p><strong>Seats:</strong> {bus.availableSeats}/{bus.totalSeats}</p>
                    <p><strong>Operator:</strong> {bus.busOperator}</p>
                  </div>
                  <button
                    className="btn-track"
                    onClick={() => handleTrackBus(bus)}
                  >
                    Track on Map
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Map Tab */}
          {activeTab === 'map' && selectedBus && (
            <div className="map-section">
              <div className="bus-info">
                <h3>{selectedBus.busNumber}</h3>
                <p><strong>Route:</strong> {selectedBus.routeName}</p>
                <p><strong>From:</strong> {selectedBus.source} → To: {selectedBus.destination}</p>
                <p><strong>Seats:</strong> {selectedBus.availableSeats}/{selectedBus.totalSeats}</p>
                <p><strong>Waypoint:</strong> {selectedBus.currentWaypointIndex + 1}</p>
                <small className="update-info">Updates every 2 seconds</small>
              </div>
              <div id="busMap" ref={mapContainer} className="map-container"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TrackingPage;
