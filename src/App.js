import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import HomePage from './pages/HomePage';
import ArtistsPage from './pages/ArtistsPage';
import EventsPage from './pages/EventsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ArtistDashboard from './pages/ArtistDashboard';
import ClientDashboard from './pages/ClientDashboard';
import PromibolNavbar from './components/PromibolNavbar';
import NotificationContainer from './components/NotificationContainer';
import ProtectedRoute from './components/ProtectedRoute';
import ArtistProfilePage from './pages/ArtistProfilePage';

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <Router>
      <PromibolNavbar />
      <NotificationContainer />
      <main className="pt-20 bg-gray-50 min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/artists" element={<ArtistsPage />} />
          <Route path="/artists/:id" element={<ArtistProfilePage />} />
          <Route path="/events" element={<EventsPage />} />

          {/* Rutas públicas que redirigen si estás autenticado */}
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} />
          
          {/* Ruta de Dashboard protegida y por roles */}
          <Route 
            path="/dashboard"
            element={
              <ProtectedRoute>
                {user?.role === 'artist' ? <ArtistDashboard /> : <ClientDashboard />}
              </ProtectedRoute>
            } 
          />
          
          {/* Redirección para cualquier otra ruta */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;

// DONE