# Real-Time Bus Tracking System - Frontend

Modern React-based frontend for real-time bus tracking and management. Provides comprehensive bus search, route visualization, and live tracking capabilities with professional UI design.

## Key Features

✅ **Secure Authentication**
- JWT-based authentication system
- User registration and login

✅ **Bus Management**
- Search buses by route (source/destination)
- View all active buses in the system
- Real-time bus position tracking

✅ **Interactive Mapping**
- Live bus tracking on interactive map
- Route polyline visualization
- Waypoint markers
- Position updates every 2 seconds

✅ **Professional Interface**
- Warm brown professional color scheme
- Responsive design for all devices
- Smooth animations and transitions

## Technology Stack

- **React** 18.2.0 - UI framework
- **React Router** 6.11.0 - Client-side routing
- **Axios** 1.4.0 - HTTP client
- **Leaflet** 1.9.4 - Interactive maps
- **React Leaflet** 4.2.1 - React integration for Leaflet

## Prerequisites

- Node.js v14 or higher
- npm or yarn package manager
- Backend server running on http://localhost:8080

## Installation & Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm start
```

Application will be available at http://localhost:3000

### 3. Production Build

```bash
npm run build
```

Optimized production build will be created in the `build/` directory.

## Deployment to Spring Boot

To deploy the React frontend with the Spring Boot backend:

1. Create production build:
   ```bash
   npm run build
   ```

2. Copy build artifacts to Spring Boot's static resources:
   ```bash
   xcopy build/* ..\src\main\resources\static\ /E /I
   ```

3. Start Spring Boot server:
   ```bash
   mvn spring-boot:run
   ```

Application will be served from http://localhost:8080

## Project Structure

```
frontend/
├── public/
│   └── index.html              HTML template with Leaflet CDN
├── src/
│   ├── components/
│   │   ├── LoginPage.js        Authentication component
│   │   ├── LoginPage.css
│   │   ├── RegisterPage.js     User registration component
│   │   ├── RegisterPage.css
│   │   ├── TrackingPage.js     Main tracking dashboard
│   │   └── TrackingPage.css
│   ├── App.js                  Root component with routing
│   ├── App.css
│   ├── index.js                React entry point
│   ├── index.css               Global styles
├── package.json
└── README.md
```

## Technologies Used

- **React 18.2.0** - UI framework
- **React Router 6.11.0** - Client-side routing
- **Axios 1.4.0** - HTTP client
- **Leaflet 1.9.4** - Interactive maps
- **React Leaflet 4.2.1** - React wrapper for Leaflet

## API Endpoints

The frontend communicates with the backend using the following REST endpoints:

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User login with email and password |
| `/api/auth/register` | POST | Create new user account |

### Bus Operations
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/buses/search` | GET | Search buses by route |
| `/api/buses/active` | GET | Retrieve all active buses |
| `/api/buses/{id}/location` | GET | Get real-time bus location |

All requests include JWT bearer token authentication.

## Development

### Available Scripts

- `npm start` - Run development server with hot reload
- `npm run build` - Create production build

### Code Quality

- Component-based architecture for reusability
- Functional components with React Hooks
- Error handling and user feedback
- Responsive design patterns

## Support & Troubleshooting

**Backend Connection Issues**
- Verify Spring Boot server is running on port 8080
- Check CORS configuration in backend
- Review browser network tab for API errors

**Map Display Problems**
- Ensure Leaflet.js and CSS are properly loaded
- Check browser console for JavaScript errors
- Verify OpenStreetMap tiles are accessible

**Authentication Failures**
- Confirm backend JWT configuration is correct
- Verify localStorage is not disabled
- Check token expiration settings

## License

MIT License

---

**Real-Time Bus Tracking System** | React Frontend | 2026
