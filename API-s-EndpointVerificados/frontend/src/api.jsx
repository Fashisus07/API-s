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
      const decodedString = decodeURIComponent(escape(atob(token)));
      const payload = JSON.parse(decodedString);
      if (payload.exp < Date.now()) {
        return null;
      }
      return payload;
    } catch (error) {
      return null;
    }
  }
}

// Exportar instancia única del servicio de autenticación
export default new AuthService();
