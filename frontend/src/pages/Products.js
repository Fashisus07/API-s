import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import api from "../api";

function Products() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const fetchProducts = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const res = await api.get("/products");
      setAllProducts(res.data);
      filterProducts(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar productos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterProducts = (productList = allProducts) => {
    const searchTerm = searchParams.get('search')?.toLowerCase() || '';
    const category = searchParams.get('category')?.toLowerCase() || '';
    
    let filtered = productList;
    
    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filtrar por categoría
    if (category) {
      filtered = filtered.filter(product => 
        product.category.toLowerCase().includes(category)
      );
    }
    
    setProducts(filtered);
  };

  const handleSearch = (searchTerm) => {
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm) {
      newParams.set('search', searchTerm);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchParams, allProducts]);

  const handleAddToCart = (product) => {
    // Callback opcional para actualizar UI después de agregar al carrito
    console.log(`Producto agregado: ${product.name}`);
  };

  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || '';
  const hasFilters = currentSearch || currentCategory;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto mt-8 bg-white p-12 rounded-lg shadow-md border border-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-secondary mb-2">Cargando productos...</h2>
          <p className="text-gray-600">Esto puede tomar unos segundos</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto mt-8 bg-white p-12 rounded-lg shadow-md border border-gray-200">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error al cargar productos</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => fetchProducts()}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark font-semibold shadow-md"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0 && !loading && !error) {
    return (
      <div className="max-w-7xl mx-auto mt-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-primary mb-4">Catálogo de productos</h1>
          <SearchBar onSearch={handleSearch} placeholder="Buscar en productos..." />
        </div>
        
        <div className="bg-white p-12 rounded-lg shadow-md border border-gray-200">
          <div className="text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-semibold text-secondary mb-2">
              {hasFilters ? 'No se encontraron productos' : 'No hay productos disponibles'}
            </h2>
            <p className="text-gray-600 mb-6">
              {hasFilters 
                ? 'Intenta con otros términos de búsqueda o categorías'
                : 'Aún no se han publicado productos en la tienda'
              }
            </p>
            <div className="space-x-4">
              {hasFilters && (
                <button 
                  onClick={clearFilters}
                  className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-dark font-semibold shadow-md"
                >
                  Limpiar filtros
                </button>
              )}
              <button 
                onClick={() => fetchProducts(true)}
                disabled={refreshing}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark font-semibold disabled:opacity-50 shadow-md"
              >
                {refreshing ? "Actualizando..." : "Actualizar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4">
      {/* Header con búsqueda */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h1 className="text-3xl font-bold text-primary">Catálogo de productos</h1>
          <button 
            onClick={() => fetchProducts(true)}
            disabled={refreshing}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium disabled:opacity-50 transition-colors border border-gray-200"
          >
            {refreshing ? "Actualizando..." : "🔄 Actualizar"}
          </button>
        </div>
        
        {/* Barra de búsqueda */}
        <div className="mb-4">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Buscar en productos..."
          />
        </div>
        
        {/* Filtros activos */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm font-medium text-gray-600">Filtros activos:</span>
            {currentSearch && (
              <span className="bg-blue-100 text-primary px-3 py-1 rounded-full text-sm font-medium border border-blue-200">
                Búsqueda: "{currentSearch}"
              </span>
            )}
            {currentCategory && (
              <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                Categoría: {currentCategory}
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-red-600 hover:text-red-800 text-sm font-medium ml-2"
            >
              ✕ Limpiar filtros
            </button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
        ))}
      </div>
      
      {/* Información de resultados */}
      <div className="text-center mt-8 text-gray-600 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <p className="font-medium">
          {hasFilters ? (
            <>Encontrados {products.length} {products.length === 1 ? 'producto' : 'productos'} 
            {currentSearch && <span>para "{currentSearch}"</span>}
            {currentCategory && <span> en {currentCategory}</span>}</>
          ) : (
            <>Mostrando {products.length} {products.length === 1 ? 'producto' : 'productos'} en total</>
          )}
        </p>
        {hasFilters && products.length === 0 && (
          <p className="text-sm text-gray-500 mt-2">
            Intenta con otros términos de búsqueda o 
            <button onClick={clearFilters} className="text-primary hover:text-primary-dark hover:underline ml-1">
              limpiar los filtros
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default Products;
