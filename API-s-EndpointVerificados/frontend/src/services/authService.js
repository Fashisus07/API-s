// Servicio de autenticación - wrapper sobre apiService
import { login as apiLogin, register as apiRegister } from './apiService';

// Objeto authService con métodos de autenticación
const authService = {
  // Función de login que retorna el formato esperado por los componentes
  login: async (email, password) => {
    try {
      const response = await apiLogin(email, password);
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
  },

  // Función de registro que retorna el formato esperado por los componentes
  register: async (userData) => {
    try {
      const response = await apiRegister({
        username: userData.email.split('@')[0],
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName || userData.name?.split(' ')[0] || 'Usuario',
        lastName: userData.lastName || userData.name?.split(' ').slice(1).join(' ') || 'Nuevo'
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
};

export default authService;
