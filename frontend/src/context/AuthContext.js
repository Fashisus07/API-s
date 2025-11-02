import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token al cargar la app
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        if (payload.exp > currentTime) {
          // Token válido, extraer información del usuario
          setUser({
            email: payload.sub,
            roles: payload.roles || ["USER"],
            name: localStorage.getItem("userName") || payload.sub,
            surname: localStorage.getItem("userSurname") || "",
            dni: localStorage.getItem("userDni") || "",
            profilePhoto: localStorage.getItem("userProfilePhoto") || null
          });
        } else {
          // Token expirado
          localStorage.removeItem("token");
          localStorage.removeItem("userName");
          localStorage.removeItem("userSurname");
          localStorage.removeItem("userDni");
          localStorage.removeItem("userProfilePhoto");
        }
      } catch (error) {
        // Token malformado
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userSurname");
        localStorage.removeItem("userDni");
        localStorage.removeItem("userProfilePhoto");
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
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        email: userEmail || payload.sub,
        roles: payload.roles || ["USER"],
        name: userName,
        surname: userSurname,
        dni: userDni,
        profilePhoto: userProfilePhoto
      });
    } catch (error) {
      console.error("Error al decodificar token:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userSurname");
    localStorage.removeItem("userDni");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userProfilePhoto");
    setUser(null);
  };

  const isAuthenticated = () => {
    return user !== null;
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
      {children}
    </AuthContext.Provider>
  );
};
