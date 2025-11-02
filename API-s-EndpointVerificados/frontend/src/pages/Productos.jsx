// Importar React y hooks necesarios para la página de productos
import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams, Link } from "react-router-dom"; // Hooks para ubicación y parámetros de búsqueda
import ProductCard from "../components/ProductCard"; // Componente de tarjeta de producto
import SearchBar from "../components/SearchBar"; // Componente de barra de búsqueda
import productsData from "../data/bs.json"; // Datos de productos desde archivo JSON

// Componente Productos - Página de listado de productos con filtros y búsqueda
function Productos() {
  const [products, setProducts] = useState([]); // Estado para productos filtrados que se muestran
  const [allProducts, setAllProducts] = useState([]); // Estado para todos los productos disponibles
  const [loading, setLoading] = useState(true); // Estado de carga inicial
  const [error, setError] = useState(""); // Estado para errores
  const [refreshing, setRefreshing] = useState(false); // Estado para refresco de datos
  const [searchParams, setSearchParams] = useSearchParams(); // Hook para manejar parámetros de URL
  const location = useLocation(); // Hook para obtener ubicación actual

  // Función para cargar productos desde el archivo JSON
  const fetchProducts = (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true); // Activar estado de refresco
    } else {
      setLoading(true); // Activar estado de carga inicial
    }

    try {
      console.log("Datos importados:", productsData);
      console.log("Productos:", productsData.products);

      if (productsData && productsData.products) {
        setAllProducts(productsData.products); // Guardar todos los productos
        filterProducts(productsData.products); // Aplicar filtros inmediatamente
        setError(""); // Limpiar errores previos
      } else {
        throw new Error("No se encontraron productos en los datos");
      }
    } catch (err) {
      console.error("Error detallado:", err);
      setError(`Error al cargar productos: ${err.message}`); // Mostrar error al usuario
    } finally {
      setLoading(false); // Desactivar estado de carga
      setRefreshing(false); // Desactivar estado de refresco
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
        product.category.toLowerCase().includes(searchTerm)
      );
    }

    // Filtrar por categoría
    if (category) {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === category
      );
    }

    setProducts(filtered);
  };

  useEffect(() => {
    console.log("useEffect ejecutándose...");
    console.log("productsData disponible:", productsData);

    // Cargar datos del JSON principal
    let allProductsList = [];
    if (productsData && productsData.products && productsData.products.length > 0) {
      allProductsList = [...productsData.products];
    }

    // Verificar si hay productos adicionales en localStorage (productos publicados por usuarios)
    try {
      const userProducts = JSON.parse(localStorage.getItem('userProducts') || '[]');
      if (userProducts.length > 0) {
        // Solo incluir productos activos en la lista general
        const activeUserProducts = userProducts.filter(p => p.status === 'active');
        // Combinar productos del JSON con productos de usuarios, evitando duplicados
        const existingIds = allProductsList.map(p => p.id);
        const newProducts = activeUserProducts.filter(p => !existingIds.includes(p.id));
        allProductsList = [...allProductsList, ...newProducts];
      }

      // También verificar allProductsData por compatibilidad
      const savedProductsData = localStorage.getItem('allProductsData');
      if (savedProductsData) {
        const parsedData = JSON.parse(savedProductsData);
        if (parsedData.products) {
          const existingIds = allProductsList.map(p => p.id);
          const newProducts = parsedData.products.filter(p => !existingIds.includes(p.id));
          allProductsList = [...allProductsList, ...newProducts];
        }
      }
    } catch (error) {
      console.log("Error cargando productos adicionales:", error);
    }

    if (allProductsList.length > 0) {
      setAllProducts(allProductsList);
      setProducts(allProductsList);
      setLoading(false);
      setError("");
      console.log("Productos cargados:", allProductsList.length);
    } else {
      setError("No se encontraron productos");
      setLoading(false);
    }
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

  const categories = [
    { name: "Todos", value: "" },
    { name: "Electrónicos", value: "electronicos" },
    { name: "Ropa", value: "ropa" },
    { name: "Hogar", value: "hogar" },
    { name: "Deportes", value: "deportes" },
    { name: "Libros", value: "libros" },
    { name: "Belleza", value: "belleza" }
  ];

  const handleCategoryFilter = (categoryValue) => {
    if (categoryValue) {
      setSearchParams({ category: categoryValue });
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
              {currentCategory && categories.find(c => c.value === currentCategory)?.name}
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
                {currentCategory && ` en ${categories.find(c => c.value === currentCategory)?.name}`}
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
