// Importar React y hooks necesarios para el contexto de autenticación
import React, { createContext, useContext, useState, useEffect } from "react";

// Crear el contexto de autenticación que será compartido por toda la aplicación
const AuthContext = createContext();

// Hook personalizado para acceder al contexto de autenticación desde cualquier componente
export const useAuth = () => {
  const context = useContext(AuthContext); // Obtener el contexto actual
  if (!context) {
    // Lanzar error si el hook se usa fuera del AuthProvider
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context; // Retornar el contexto con todas las funciones y estados
};

// Componente proveedor que envuelve la aplicación y proporciona el estado de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Estado para almacenar los datos del usuario autenticado
  const [loading, setLoading] = useState(true); // Estado para controlar la carga inicial

  // Función utilitaria para limpiar todos los datos de autenticación del localStorage
  const clearAuthData = () => {
    localStorage.removeItem("token"); // Eliminar token de autenticación
    localStorage.removeItem("userName"); // Eliminar nombre del usuario
    localStorage.removeItem("userSurname"); // Eliminar apellido del usuario
    localStorage.removeItem("userDni"); // Eliminar DNI del usuario
    localStorage.removeItem("userProfilePhoto"); // Eliminar foto de perfil
    localStorage.removeItem("userEmail"); // Eliminar email del usuario
  };

  // useEffect que se ejecuta al montar el componente para verificar autenticación existente
  useEffect(() => {
    // Verificar si hay un token guardado en localStorage al cargar la aplicación
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decodificar JWT estándar (formato: header.payload.signature)
        const parts = token.split('.');
        if (parts.length === 3) {
          // Decodificar la parte payload del JWT
          const decodedPayload = JSON.parse(atob(parts[1]));
          const currentTime = Math.floor(Date.now() / 1000); // Convertir a segundos (JWT usa segundos)

          if (decodedPayload.exp > currentTime) {
            // Token válido y no expirado - restaurar estado del usuario
            setUser({
              email: decodedPayload.sub, // 'sub' es el email en nuestro JWT
              roles: decodedPayload.roles || ["USER"], // Roles del JWT
              name: localStorage.getItem("userName") || decodedPayload.sub, // Nombre guardado o email como fallback
              surname: localStorage.getItem("userSurname") || "", // Apellido guardado o vacío
              profilePhoto: localStorage.getItem("userProfilePhoto") || null, // Foto de perfil o null
            });
          } else {
            // Token expirado - limpiar datos de autenticación
            clearAuthData();
          }
        } else {
          // Token malformado
          clearAuthData();
        }
      } catch (error) {
        console.error("Token corrupto detectado, limpiando localStorage:", error);
        // Token malformado o corrupto - limpiar todo para evitar errores
        clearAuthData();
      }
    }
    setLoading(false); // Finalizar estado de carga
  }, []); // Array vacío significa que solo se ejecuta una vez al montar

  // Función para iniciar sesión - guarda datos del usuario y token en localStorage
  const login = (token, userName, userSurname = "", userEmail = "", userProfilePhoto = null) => {
    localStorage.setItem("token", token); // Guardar token de autenticación JWT
    localStorage.setItem("userName", userName); // Guardar nombre del usuario
    localStorage.setItem("userSurname", userSurname); // Guardar apellido del usuario
    localStorage.setItem("userEmail", userEmail); // Guardar email del usuario
    localStorage.setItem("userProfilePhoto", userProfilePhoto || ""); // Guardar foto de perfil o cadena vacía

    try {
      // Decodificar JWT estándar (formato: header.payload.signature)
      const parts = token.split('.');
      if (parts.length === 3) {
        const decodedPayload = JSON.parse(atob(parts[1])); // Extraer y decodificar payload
        // Actualizar estado del usuario con los datos proporcionados y del token
        setUser({
          email: userEmail || decodedPayload.sub, // Usar email proporcionado o del token (sub = email)
          roles: decodedPayload.roles || ["USER"], // Roles del token o USER por defecto
          name: userName, // Nombre proporcionado
          surname: userSurname, // Apellido proporcionado
          profilePhoto: userProfilePhoto, // Foto proporcionada
        });
      }
    } catch (error) {
      console.error("Error al decodificar token:", error);
    }
  };

  // Función para cerrar sesión - limpia todos los datos del usuario
  const logout = () => {
    clearAuthData(); // Limpiar localStorage
    setUser(null); // Resetear estado del usuario
  };

  // Función para verificar si el usuario está autenticado
  const isAuthenticated = () => {
    const token = localStorage.getItem("token"); // Obtener token del localStorage
    return user !== null && token !== null; // Verificar que existan tanto user como token
  };

  // Objeto con todos los valores y funciones que se proporcionarán a los componentes hijos
  const value = {
    user, // Estado actual del usuario
    login, // Función para iniciar sesión
    logout, // Función para cerrar sesión
    isAuthenticated, // Función para verificar autenticación
    loading // Estado de carga
  };

  // Proveedor del contexto que envuelve los componentes hijos
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
