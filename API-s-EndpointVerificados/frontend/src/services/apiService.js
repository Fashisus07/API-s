// Configuración de la URL base del backend
const API_BASE_URL = 'http://localhost:8080/api';

// Helper para obtener el token de autenticación
const getAuthToken = () => {
  // El token se guarda directamente en localStorage con la clave 'token'
  return localStorage.getItem('token');
};

// Helper para crear headers con autenticación
const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// ==================== CATEGORÍAS ====================

// Obtener todas las categorías
export const getCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error('Error al obtener categorías');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Obtener una categoría por ID
export const getCategoryById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener categoría');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
};

// ==================== PRODUCTOS ====================

// Obtener todos los productos
export const getProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error('Error al obtener productos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Obtener un producto por ID
export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener producto');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

// Crear un nuevo producto (requiere autenticación)
export const createProduct = async (productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error al crear producto' }));
      throw new Error(error.message || 'Error al crear producto');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// ==================== AUTENTICACIÓN ====================

// Login de usuario
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al iniciar sesión');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

// Registro de usuario
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al registrar usuario');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};

// ==================== CARRITO ====================

// Obtener carrito del usuario
export const getCart = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener carrito');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching cart:', error);
    return [];
  }
};

// Agregar producto al carrito
export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, quantity }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al agregar al carrito');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

// Actualizar cantidad en el carrito
export const updateCartItem = async (productId, quantity) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/update`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, quantity }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar carrito');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
};

// Remover producto del carrito
export const removeFromCart = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/remove/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Error al remover del carrito');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

// Finalizar compra
export const checkout = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/checkout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al finalizar compra');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en checkout:', error);
    throw error;
  }
};

// ==================== PERFIL DE USUARIO ====================

// Obtener perfil del usuario
export const getUserProfile = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/me`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener perfil');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

// Actualizar perfil del usuario
export const updateUserProfile = async (profileData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/update`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar perfil');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Cambiar contraseña
export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/change-password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al cambiar contraseña');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};
