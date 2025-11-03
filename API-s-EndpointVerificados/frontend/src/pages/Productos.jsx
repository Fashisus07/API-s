// Importar React y hooks necesarios para la página de productos
import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams, Link } from "react-router-dom"; // Hooks para ubicación y parámetros de búsqueda
import ProductCard from "../components/ProductCard"; // Componente de tarjeta de producto
import SearchBar from "../components/SearchBar"; // Componente de barra de búsqueda
import { getProducts, getCategories } from "../services/apiService"; // Servicio para obtener productos y categorías del backend

// Componente Productos - Página de listado de productos con filtros y búsqueda
function Productos() {
  const [products, setProducts] = useState([]); // Estado para productos filtrados que se muestran
  const [allProducts, setAllProducts] = useState([]); // Estado para todos los productos disponibles
  const [categories, setCategories] = useState([]); // Estado para categorías dinámicas
  const [loading, setLoading] = useState(true); // Estado de carga inicial
  const [error, setError] = useState(""); // Estado para errores
  const [refreshing, setRefreshing] = useState(false); // Estado para refresco de datos
  const [searchParams, setSearchParams] = useSearchParams(); // Hook para manejar parámetros de URL
  const location = useLocation(); // Hook para obtener ubicación actual

  // Función para cargar productos desde el backend
  const fetchProducts = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const productsData = await getProducts();
      console.log("Productos cargados desde backend:", productsData);

      if (productsData && productsData.length > 0) {
        setAllProducts(productsData);
        filterProducts(productsData);
        setError("");
      } else {
        setAllProducts([]);
        setProducts([]);
        setError("");
      }
    } catch (err) {
      console.error("Error cargando productos:", err);
      setError(`Error al cargar productos: ${err.message}`);
      setAllProducts([]);
      setProducts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Función para filtrar productos basado en parámetros de búsqueda y categoría
  const filterProducts = (productList = allProducts) => {
    const searchTerm = searchParams.get('search')?.toLowerCase() || ''; // Obtener término de búsqueda de la URL
    const category = searchParams.get('category')?.toLowerCase() || ''; // Obtener categoría de la URL

    let filtered = productList; // Inicializar con todos los productos

    // Aplicar filtro de búsqueda por texto
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        (product.categoryName && product.categoryName.toLowerCase().includes(searchTerm))
      );
    }

    // Filtrar por categoría (usando categoryName del producto)
    if (category) {
      filtered = filtered.filter(product => {
        const productCategory = product.categoryName?.toLowerCase() || '';
        return productCategory === category;
      });
    }

    setProducts(filtered);
  };

  // Cargar categorías desde el backend
  const fetchCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories([{ id: 0, name: "Todos" }, ...categoriesData]);
    } catch (err) {
      console.error("Error cargando categorías:", err);
      setCategories([{ id: 0, name: "Todos" }]);
    }
  };

  useEffect(() => {
    console.log("useEffect ejecutándose - cargando productos y categorías desde backend...");
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (allProducts.length > 0) {
      filterProducts();
    }
  }, [searchParams, allProducts]);

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      setSearchParams({ search: searchTerm });
    } else {
      setSearchParams({});
    }
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const handleCategoryFilter = (categoryName) => {
    if (categoryName && categoryName !== "Todos") {
      setSearchParams({ category: categoryName.toLowerCase() });
    } else {
      setSearchParams({});
    }
  };

  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          {/* Mostrar filtro aplicado si existe */}
          {(currentSearch || currentCategory) && (
            <p className="text-sm text-gray-600 mb-2">
              Filtro aplicado: {currentSearch && `"${currentSearch}"`}
              {currentSearch && currentCategory && ' - '}
              {currentCategory && categories.find(c => c.name.toLowerCase() === currentCategory)?.name}
            </p>
          )}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Productos</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="mb-4">
              <p className="text-gray-600">
                Mostrando {products.length} producto{products.length !== 1 ? 's' : ''}
                {currentSearch && ` para "${currentSearch}"`}
                {currentCategory && ` en ${categories.find(c => c.name.toLowerCase() === currentCategory)?.name}`}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                  <Link
                    to={`/producto/${product.id}`}
                    className="absolute inset-0 z-10"
                    aria-label={`Ver detalles de ${product.name}`}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-500 mb-6">
              {currentSearch || currentCategory
                ? "Intenta ajustar tus filtros de búsqueda"
                : "Aún no hay productos disponibles"
              }
            </p>
            {(currentSearch || currentCategory) && (
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver todos los productos
              </button>
            )}
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Productos;
