// Importar datos de usuarios desde archivo JSON local
import usersData from '../data/users.json';

// Clase para manejar autenticación de usuarios (simulación de backend)
class AuthService {
  constructor() {
    // Inicializar lista de usuarios con datos del JSON
    this.users = [...usersData.users];
    // Cargar usuarios adicionales desde localStorage si existen
    this.loadUsersFromStorage();
  }

  // Cargar usuarios del localStorage si existen (para persistir registros nuevos)
  loadUsersFromStorage() {
    // Obtener usuarios guardados en localStorage
    const storedUsers = localStorage.getItem('ecommerce_users');
    // Si existen usuarios guardados, reemplazar la lista actual
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    }
  }

  // Guardar usuarios en localStorage para persistencia
  saveUsersToStorage() {
    // Convertir lista de usuarios a JSON y guardar en localStorage
    localStorage.setItem('ecommerce_users', JSON.stringify(this.users));
  }

  // Simular proceso de login con validación de credenciales
  async login(email, password) {
    // Retornar una promesa para simular petición asíncrona
    return new Promise((resolve, reject) => {
      // Simular delay de red con setTimeout
      setTimeout(() => {
        // Buscar usuario que coincida con email, password y esté activo
        const user = this.users.find(u =>
          u.email === email && u.password === password && u.isActive
        );

        // Si se encuentra el usuario, generar respuesta exitosa
        if (user) {
          // Generar token JWT simulado
          const token = this.generateToken(user);
          // Crear objeto de respuesta con datos del usuario
          const userResponse = {
            token,
            name: user.firstName,
            surname: user.lastName,
            email: user.email,
            username: user.username,
            role: user.role,
            id: user.id
          };
          // Resolver promesa con datos del usuario
          resolve({ data: userResponse });
        } else {
          // Si no se encuentra, rechazar con error de credenciales
          reject({
            response: {
              data: {
                error: 'Credenciales incorrectas'
              }
            }
          });
        }
      }, 500); // Simular delay de red de 500ms
    });
  }

  // Simular proceso de registro de nuevos usuarios
  async register(userData) {
    // Retornar promesa para simular petición asíncrona
    return new Promise((resolve, reject) => {
      // Simular delay de red con setTimeout
      setTimeout(() => {
        // Verificar si el email ya existe en la base de datos
        const existingUser = this.users.find(u => u.email === userData.email);
        if (existingUser) {
          // Si el email ya existe, rechazar con error
          reject({
            response: {
              data: {
                error: 'El email ya está registrado'
              }
            }
          });
          return;
        }

        // Crear nuevo objeto usuario con datos proporcionados
        const newUser = {
          id: this.getNextId(), // Generar ID único
          username: userData.email.split('@')[0], // Usar parte del email como username
          email: userData.email,
          password: userData.password,
          firstName: userData.name,
          lastName: userData.surname,
          dni: userData.dni,
          role: 'user', // Rol por defecto para nuevos usuarios
          createdAt: new Date().toISOString(), // Fecha de creación
          isActive: true // Usuario activo por defecto
        };

        // Agregar nuevo usuario a la lista
        this.users.push(newUser);
        // Guardar lista actualizada en localStorage
        this.saveUsersToStorage();

        // Generar token JWT para el nuevo usuario
        const token = this.generateToken(newUser);
        // Crear objeto de respuesta con datos del usuario registrado
        const userResponse = {
          token,
          name: newUser.firstName,
          surname: newUser.lastName,
          email: newUser.email,
          username: newUser.username,
          dni: newUser.dni,
          role: newUser.role,
          id: newUser.id
        };

        // Resolver promesa con datos del usuario registrado
        resolve({ data: userResponse });
      }, 800); // Simular delay de red de 800ms
    });
  }

  // Generar token JWT simple (en producción usar librería JWT real)
  generateToken(user) {
    // Crear payload con información del usuario y expiración
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + (24 * 60 * 60 * 1000) // Expira en 24 horas
    };
    // Convertir payload a JSON string
    const jsonString = JSON.stringify(payload);
    // Codificar a base64 de forma segura para caracteres especiales
    return btoa(unescape(encodeURIComponent(jsonString)));
  }

  // Verificar validez y decodificar token JWT
  verifyToken(token) {
    try {
      // Decodificar token desde base64
      const decodedString = decodeURIComponent(escape(atob(token)));
      // Parsear JSON del payload
      const payload = JSON.parse(decodedString);
      // Verificar si el token ha expirado
      if (payload.exp < Date.now()) {
        return null; // Token expirado
      }
      // Retornar payload si el token es válido
      return payload;
    } catch (error) {
      // Si hay error en decodificación, token es inválido
      return null; // Token inválido
    }
  }

  // Obtener siguiente ID disponible para nuevos usuarios
  getNextId() {
    // Encontrar el ID más alto en la lista de usuarios
    const maxId = Math.max(...this.users.map(u => u.id), 0);
    // Retornar el siguiente ID disponible
    return maxId + 1;
  }

  // Obtener todos los usuarios activos (para funciones de administrador)
  getAllUsers() {
    // Filtrar solo usuarios activos
    return this.users.filter(u => u.isActive);
  }

  // Buscar usuario específico por ID
  getUserById(id) {
    // Encontrar usuario por ID que esté activo
    return this.users.find(u => u.id === id && u.isActive);
  }
}

// Exportar instancia única del servicio de autenticación (patrón Singleton)
export default new AuthService();
