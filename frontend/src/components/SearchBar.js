import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchBar = ({ onSearch, placeholder = "Buscar productos, marcas y más..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize search term from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      if (onSearch) {
        onSearch(searchTerm.trim());
      } else {
        // Navigate to products page with search query
        navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      }
    } else {
      // If empty search, go to products without search parameter
      navigate('/products');
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    navigate('/products');
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 max-w-2xl mx-4">
      <div className="relative flex">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-l-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100 transition-all"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 px-2"
          >
            ✕
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-3 bg-primary text-white font-semibold rounded-r-md hover:bg-primary-dark transition-colors border-2 border-primary hover:border-primary-dark shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
