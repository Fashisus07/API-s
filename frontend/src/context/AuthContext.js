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
        // Decodificar el token (no es JWT, es un token personalizado codificado en base64)
        const decodedString = decodeURIComponent(atob(token));
        const payload = JSON.parse(decodedString); // Parsear el JSON del token
        const currentTime = Date.now(); // Obtener tiempo actual para verificar expiración

        if (payload.exp > currentTime) {
          // Token válido y no expirado - restaurar estado del usuario
          setUser({
            email: payload.email, // Email del token
            roles: [payload.role?.toUpperCase() || "USER"], // Rol del usuario (convertido a mayúsculas)
            name: localStorage.getItem("userName") || payload.email, // Nombre guardado o email como fallback
            surname: localStorage.getItem("userSurname") || "", // Apellido guardado o vacío
            dni: localStorage.getItem("userDni") || "", // DNI guardado o vacío
            profilePhoto: localStorage.getItem("userProfilePhoto") || null, // Foto de perfil o null
            id: payload.id // ID del usuario del token
          });
        } else {
          // Token expirado - limpiar datos de autenticación
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
  const login = (token, userName, userSurname = "", userEmail = "", userDni = "", userProfilePhoto = null) => {
    localStorage.setItem("token", token); // Guardar token de autenticación
    localStorage.setItem("userName", userName); // Guardar nombre del usuario
    localStorage.setItem("userSurname", userSurname); // Guardar apellido del usuario
    localStorage.setItem("userEmail", userEmail); // Guardar email del usuario
    localStorage.setItem("userDni", userDni); // Guardar DNI del usuario
    localStorage.setItem("userProfilePhoto", userProfilePhoto || ""); // Guardar foto de perfil o cadena vacía

    try {
      // Decodificar el token personalizado (no es JWT estándar)
      const decodedString = decodeURIComponent(atob(token));
      const payload = JSON.parse(decodedString); // Extraer datos del token
      // Actualizar estado del usuario con los datos proporcionados y del token
      setUser({
        email: userEmail || payload.email, // Usar email proporcionado o del token
        roles: [payload.role?.toUpperCase() || "USER"], // Rol del token o USER por defecto
        name: userName, // Nombre proporcionado
        surname: userSurname, // Apellido proporcionado
        dni: userDni, // DNI proporcionado
        profilePhoto: userProfilePhoto, // Foto proporcionada
        id: payload.id // ID del token
      });
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
