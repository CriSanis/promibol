import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si el usuario es artista para acceder al dashboard
  if (user && user.role !== 'artist') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;