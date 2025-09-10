import usersData from '../data/users.json';

class AuthService {
  constructor() {
    this.users = [...usersData.users];
    this.loadUsersFromStorage();
  }

  // Cargar usuarios del localStorage si existen
  loadUsersFromStorage() {
    const storedUsers = localStorage.getItem('ecommerce_users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    }
  }

  // Guardar usuarios en localStorage
  saveUsersToStorage() {
    localStorage.setItem('ecommerce_users', JSON.stringify(this.users));
  }

  // Simular login
  async login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.users.find(u => 
          u.email === email && u.password === password && u.isActive
        );
        
        if (user) {
          const token = this.generateToken(user);
          const userResponse = {
            token,
            name: user.firstName,
            surname: user.lastName,
            email: user.email,
            username: user.username,
            role: user.role,
            id: user.id
          };
          resolve({ data: userResponse });
        } else {
          reject({
            response: {
              data: {
                error: 'Credenciales incorrectas'
              }
            }
          });
        }
      }, 500); // Simular delay de red
    });
  }

  // Simular registro
  async register(userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Verificar si el email ya existe
        const existingUser = this.users.find(u => u.email === userData.email);
        if (existingUser) {
          reject({
            response: {
              data: {
                error: 'El email ya está registrado'
              }
            }
          });
          return;
        }

        // Crear nuevo usuario
        const newUser = {
          id: this.getNextId(),
          username: userData.email.split('@')[0], // Usar parte del email como username
          email: userData.email,
          password: userData.password,
          firstName: userData.name,
          lastName: userData.surname,
          dni: userData.dni,
          role: 'user',
          createdAt: new Date().toISOString(),
          isActive: true
        };

        // Agregar usuario a la lista
        this.users.push(newUser);
        this.saveUsersToStorage();

        // Generar token y respuesta
        const token = this.generateToken(newUser);
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

        resolve({ data: userResponse });
      }, 800); // Simular delay de red
    });
  }

  // Generar token simple (en producción usar JWT real)
  generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
    };
    // Convertir a string y luego a base64 de forma segura
    const jsonString = JSON.stringify(payload);
    return btoa(unescape(encodeURIComponent(jsonString)));
  }

  // Verificar token
  verifyToken(token) {
    try {
      const decodedString = decodeURIComponent(escape(atob(token)));
      const payload = JSON.parse(decodedString);
      if (payload.exp < Date.now()) {
        return null; // Token expirado
      }
      return payload;
    } catch (error) {
      return null; // Token inválido
    }
  }

  // Obtener siguiente ID disponible
  getNextId() {
    const maxId = Math.max(...this.users.map(u => u.id), 0);
    return maxId + 1;
  }

  // Obtener todos los usuarios (para admin)
  getAllUsers() {
    return this.users.filter(u => u.isActive);
  }

  // Buscar usuario por ID
  getUserById(id) {
    return this.users.find(u => u.id === id && u.isActive);
  }
}

export default new AuthService();
