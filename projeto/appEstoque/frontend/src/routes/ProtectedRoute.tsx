// src/routes/ProtectedRoute.tsx

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute() {
  const { logado } = useAuth();

  if (!logado) {
    
    return <Navigate to="/login" replace />;
  }

  
  return <Outlet />;
}