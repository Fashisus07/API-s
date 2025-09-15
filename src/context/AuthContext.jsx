import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
}
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para limpiar localStorage completamente
  const clearAuthData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userSurname");
    localStorage.removeItem("userDni");
    localStorage.removeItem("userProfilePhoto");
    localStorage.removeItem("userEmail");
  };

  useEffect(() => {
    // Verificar si hay un token al cargar la app
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Nuestro token es simple, no JWT, así que lo decodificamos directamente
        const decodedString = decodeURIComponent(atob(token));
        const payload = JSON.parse(decodedString);
        const currentTime = Date.now();
        
        if (payload.exp > currentTime) {
          // Token válido, extraer información del usuario
          setUser({
            email: payload.email,
            roles: [payload.role?.toUpperCase() || "USER"],
            name: localStorage.getItem("userName") || payload.email,
            surname: localStorage.getItem("userSurname") || "",
            dni: localStorage.getItem("userDni") || "",
            profilePhoto: localStorage.getItem("userProfilePhoto") || null,
            id: payload.id
          });
        } else {
          // Token expirado
          clearAuthData();
        }
      } catch (error) {
        console.error("Token corrupto detectado, limpiando localStorage:", error);
        // Token malformado - limpiar todo
        clearAuthData();
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userName, userSurname = "", userEmail = "", userDni = "", userProfilePhoto = null) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userName", userName);
    localStorage.setItem("userSurname", userSurname);
    localStorage.setItem("userEmail", userEmail);
    localStorage.setItem("userDni", userDni);
    localStorage.setItem("userProfilePhoto", userProfilePhoto || "");
    
    try {
      // Nuestro token es simple, no JWT
      const decodedString = decodeURIComponent(atob(token));
      const payload = JSON.parse(decodedString);
      setUser({
        email: userEmail || payload.email,
        roles: [payload.role?.toUpperCase() || "USER"],
        name: userName,
        surname: userSurname,
        dni: userDni,
        profilePhoto: userProfilePhoto,
        id: payload.id
      });
    } catch (error) {
      console.error("Error al decodificar token:", error);
    }
  };

  const logout = () => {
    clearAuthData();
    setUser(null);
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return user !== null && token !== null;
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
