import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import TrackingPage from './components/TrackingPage';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('jwtToken');
    const userData = localStorage.getItem('userData');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleRegister = (userData) => {
    // After registration, redirect to login
    return true;
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/track" /> : <LoginPage onLogin={handleLogin} />}
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/track" /> : <RegisterPage onRegister={handleRegister} />}
          />
          <Route 
            path="/track" 
            element={isAuthenticated ? <TrackingPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/track" : "/login"} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
