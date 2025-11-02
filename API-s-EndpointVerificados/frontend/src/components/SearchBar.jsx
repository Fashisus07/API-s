// Importar React y hooks necesarios para el componente de búsqueda
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Hooks para navegación y ubicación

// Componente SearchBar - Barra de búsqueda de productos
const SearchBar = ({ onSearch, placeholder = "Buscar productos, marcas y más..." }) => {
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
  const navigate = useNavigate(); // Hook para navegación programática
  const location = useLocation(); // Hook para obtener la ubicación actual

  // useEffect para inicializar el término de búsqueda desde los parámetros de la URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search); // Obtener parámetros de la URL
    const searchParam = urlParams.get('search'); // Extraer parámetro 'search'
    if (searchParam) {
      setSearchTerm(searchParam); // Establecer término de búsqueda si existe en la URL
    }
  }, [location.search]); // Dependencia: se ejecuta cuando cambian los parámetros de búsqueda

  // Función para manejar el envío del formulario de búsqueda
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevenir comportamiento por defecto del formulario
    if (searchTerm.trim()) {
      if (onSearch) {
        // Si se proporciona función onSearch personalizada, usarla
        onSearch(searchTerm.trim());
      } else {
        // Navegar a la página de productos con el término de búsqueda como parámetro
        navigate(`/productos?search=${encodeURIComponent(searchTerm.trim())}`);
      }
    } else {
      // Si la búsqueda está vacía, ir a productos sin parámetro de búsqueda
      navigate('/productos');
    }
  };

  // Función para limpiar el campo de búsqueda
  const handleClear = () => {
    setSearchTerm(''); // Limpiar término de búsqueda
    navigate('/productos'); // Navegar a productos sin filtros
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 max-w-2xl mx-4">
      <div className="relative flex">
        {/* Campo de entrada para el término de búsqueda */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Actualizar estado cuando cambia el input
          placeholder={placeholder}
          className="flex-1 px-4 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-l-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
        />
        {/* Botón para limpiar búsqueda - solo se muestra si hay texto */}
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 px-2"
          >
            ✕
          </button>
        )}
        {/* Botón de búsqueda con icono de lupa */}
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-r-md hover:bg-blue-700 transition-colors border-2 border-blue-600 hover:border-blue-700 shadow-md"
        >
          {/* Icono SVG de lupa */}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
