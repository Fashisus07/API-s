// Este archivo ahora redirige a apiService.js para mantener compatibilidad
// Se recomienda usar directamente apiService.js en nuevos componentes

import { login, register } from './services/apiService';

// Clase para mantener compatibilidad con código existente
class AuthService {
  async login(email, password) {
    try {
      const response = await login(email, password);
      return { data: response };
    } catch (error) {
      throw {
        response: {
          data: {
            error: error.message || 'Credenciales incorrectas'
          }
        }
      };
    }
  }

  async register(userData) {
    try {
      const response = await register({
        username: userData.email.split('@')[0],
        email: userData.email,
        password: userData.password,
        firstName: userData.name,
        lastName: userData.surname
      });
      return { data: response };
    } catch (error) {
      throw {
        response: {
          data: {
            error: error.message || 'Error al registrar usuario'
          }
        }
      };
    }
  }

  verifyToken(token) {
    try {
      // Decodificar JWT estándar (formato: header.payload.signature)
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }
      
      const decodedPayload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000); // Convertir a segundos (JWT usa segundos)
      
      if (decodedPayload.exp > currentTime) {
        return decodedPayload;
      }
      return null;
    } catch (error) {
      console.error('Error al verificar token:', error);
      return null;
    }
  }
}

// Exportar instancia única del servicio de autenticación
export default new AuthService();
