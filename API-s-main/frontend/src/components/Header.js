import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SearchBar from "./SearchBar";

function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const showSearchBar = location.pathname === "/" || location.pathname === "/productos";

  return (
    <header className="bg-white text-secondary shadow-lg border-b border-gray-200">
      {/* Top bar */}
      <div className="bg-primary px-4 py-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-white">📍 Envío gratis desde $25.000</span>
          </div>
          <nav className="flex items-center space-x-4">
            {isAuthenticated() ? (
              <>
                <span className="text-accent-light">Hola, {user?.name}</span>
                <Link to="/carrito" className="text-white hover:text-accent-light transition">Mis compras</Link>
                <button 
                  onClick={handleLogout}
                  className="text-white hover:text-accent-light transition"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link to="/register" className="text-white hover:text-accent-light transition">Creá tu cuenta</Link>
                <Link to="/login" className="text-white hover:text-accent-light transition">Ingresá</Link>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Main header */}
      <div className="px-4 py-4 bg-white">
        <div className="max-w-7xl mx-auto flex items-center">
          {/* Logo */}
          <Link to="/" className="hover:opacity-80 transition mr-8">
            <img 
              src="/UADE-commerce.png" 
              alt="UADE Commerce" 
              className="h-20 w-auto"
            />
          </Link>

          {/* Search bar */}
          {showSearchBar && (
            <SearchBar placeholder="Buscar productos, marcas y más..." />
          )}

          {/* Right side navigation */}
          <nav className="flex items-center space-x-6 ml-8">
            <Link to="/" className="text-secondary hover:text-primary font-medium transition flex items-center">
              <span className="mr-1">🏠</span> Inicio
            </Link>
            <Link to="/productos" className="text-secondary hover:text-primary font-medium transition flex items-center">
              <span className="mr-1">📦</span> Productos
            </Link>
            
            {/* Carrito - visible para todos */}
            <Link to={isAuthenticated() ? "/carrito" : "/login"} className="text-secondary hover:text-primary font-medium transition flex items-center relative">
              <span className="mr-1">🛒</span> Carrito
            </Link>
            
            {isAuthenticated() && (
              <Link to="/publish" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark font-medium transition shadow-md">
                Vender
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Categories bar */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-8 text-sm text-gray-600">
            <span className="font-semibold text-primary">Categorías:</span>
            <Link to="/productos?category=electronicos" className="hover:text-primary transition">Electrónicos</Link>
            <Link to="/productos?category=ropa" className="hover:text-primary transition">Ropa</Link>
            <Link to="/productos?category=hogar" className="hover:text-primary transition">Hogar</Link>
            <Link to="/productos?category=deportes" className="hover:text-primary transition">Deportes</Link>
            <Link to="/productos?category=libros" className="hover:text-primary transition">Libros</Link>
            <Link to="/productos" className="text-primary hover:text-primary-dark transition font-medium">Ver todas →</Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
