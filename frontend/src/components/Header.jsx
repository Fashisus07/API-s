// Importar React y hooks necesarios para navegación y contextos
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Hooks para navegación y ubicación
import { useAuth } from "../context/AuthContext"; // Contexto de autenticación
import { useCart } from "../context/CartContext"; // Contexto del carrito
import SearchBar from "./SearchBar"; // Componente de barra de búsqueda

// Componente Header - Barra de navegación principal de la aplicación
function Header() {
  const { user, logout, isAuthenticated } = useAuth(); // Obtener datos y funciones de autenticación
  const { getTotalItems } = useCart(); // Obtener función para contar items del carrito
  const navigate = useNavigate(); // Hook para navegación programática
  const location = useLocation(); // Hook para obtener la ubicación actual

  // Función para manejar el cierre de sesión (actualmente no se usa en este componente)
  const handleLogout = () => {
    logout(); // Ejecutar logout del contexto
    navigate("/"); // Redirigir a la página principal
  };

  // Determinar si mostrar la barra de búsqueda (solo en la página principal)
  const showSearchBar = location.pathname === "/";

  return (
    <header className="bg-white text-secondary shadow-lg border-b border-gray-200">
      {/* Barra superior con información promocional y autenticación */}
      <div className="bg-primary px-4 py-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          {/* Información promocional del lado izquierdo */}
          <div className="flex items-center space-x-4">
            <span className="text-white">📍 Envío gratis desde $25.000</span>
          </div>
          {/* Navegación de usuario del lado derecho */}
          <nav className="flex items-center space-x-4">
            {isAuthenticated() ? (
              <>
                {/* Enlace al perfil del usuario autenticado */}
                <Link to="/perfil" className="flex items-center space-x-2 hover:text-accent-light transition cursor-pointer">
                  {/* Avatar circular con inicial del nombre */}
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-accent-light">Hola, {user?.name}</span>
                </Link>
                {/* Enlace a las compras del usuario */}
                <Link to="/mis-compras" className="text-white hover:text-accent-light transition">Mis compras</Link>
              </>
            ) : (
              <>
                {/* Enlaces para usuarios no autenticados */}
                <Link to="/register" className="text-white hover:text-accent-light transition">Creá tu cuenta</Link>
                <Link to="/login" className="text-white hover:text-accent-light transition">Ingresá</Link>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Header principal con logo, búsqueda y navegación */}
      <div className="px-4 py-4 bg-white">
        <div className="max-w-7xl mx-auto flex items-center">
          {/* Logo de la aplicación */}
          <Link to="/" className="hover:opacity-80 transition mr-8">
            <img
              src="/UADE-commerce.png"
              alt="UADE Commerce"
              className="h-20 w-auto"
            />
          </Link>

          {/* Barra de búsqueda - solo se muestra en la página principal */}
          {showSearchBar && (
            <SearchBar placeholder="Buscar productos, marcas y más..." />
          )}

          {/* Navegación del lado derecho */}
          <nav className="flex items-center space-x-6 ml-8">
            {/* Enlace para vender productos */}
            <Link to="/publish" className="text-secondary hover:text-primary font-medium transition flex items-center">
              <span className="mr-1">💼</span> Vender
            </Link>
            {/* Enlace a productos del usuario (solo si está autenticado) */}
            {isAuthenticated() && (
              <Link to="/mis-productos" className="text-secondary hover:text-primary font-medium transition flex items-center">
                <span className="mr-1">📦</span> Mis Productos
              </Link>
            )}
            {/* Enlace a todos los productos */}
            <Link to="/productos" className="text-secondary hover:text-primary font-medium transition flex items-center">
              <span className="mr-1">📦</span> Productos
            </Link>

            {/* Enlace al carrito con contador de items */}
            <Link to="/carrito" className="text-secondary hover:text-primary font-medium transition flex items-center relative">
              <span className="mr-1">🛒</span> Carrito
              {/* Badge con número de items si hay productos en el carrito */}
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* Botón destacado para vender (solo si está autenticado) */}
            {isAuthenticated() && (
              <Link to="/publish" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark font-medium transition shadow-md">
                Vender
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Barra de categorías */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-8 text-sm text-gray-600">
            <span className="font-semibold text-primary">Categorías:</span>
            {/* Enlaces a diferentes categorías de productos */}
            <Link to="/productos?category=electronicos" className="hover:text-primary transition">Electrónicos</Link>
            <Link to="/productos?category=ropa" className="hover:text-primary transition">Ropa</Link>
            <Link to="/productos?category=hogar" className="hover:text-primary transition">Hogar</Link>
            <Link to="/productos?category=deportes" className="hover:text-primary transition">Deportes</Link>
            <Link to="/productos?category=libros" className="hover:text-primary transition">Libros</Link>
            {/* Enlace para ver todas las categorías */}
            <Link to="/productos" className="text-primary hover:text-primary-dark transition font-medium">Ver todas →</Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
