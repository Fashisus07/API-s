import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  
  // Verificar si el token existe y no está expirado (básico)
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Verificación básica de expiración del JWT
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (payload.exp < currentTime) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    // Token malformado
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
