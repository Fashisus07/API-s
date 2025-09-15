import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ProductCard from "../components/ProductCard";
import productsData from "../data/bs.json";

function Inicio() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Debug: Log the imported data
  console.log('Imported products data:', productsData);
  console.log('Products array:', productsData.products);

  useEffect(() => {
    // Simular carga de productos destacados
    const loadFeaturedProducts = async () => {
      try {
        console.log("Cargando productos destacados...");
        
        // Verificar si productsData es válido
        if (!productsData) {
          throw new Error("No se pudieron cargar los datos de productos");
        }
        
        // Verificar si productsData.products existe y es un array
        if (!productsData.products || !Array.isArray(productsData.products)) {
          console.warn("La estructura de productsData no es la esperada:", productsData);
          
          // Intentar acceder a los productos directamente si están en el nivel superior
          const productsArray = Array.isArray(productsData) ? productsData : [];
          
          if (productsArray.length > 0) {
            console.log("Se encontraron productos en el nivel superior:", productsArray);
            const data = productsArray.slice(0, 8);
            setFeaturedProducts(data);
            return;
          }
          
          throw new Error("No se encontraron productos en los datos");
        }
        
        // Si llegamos aquí, la estructura es la esperada
        const data = productsData.products.slice(0, 8);
        console.log("Productos destacados cargados:", data);
        
        if (!data || data.length === 0) {
          throw new Error("No hay productos disponibles");
        }
        
        setFeaturedProducts(data);
      } catch (err) {
        console.error("Error al cargar productos destacados:", {
          error: err,
          message: err.message,
          stack: err.stack
        });
        setError(`No se pudieron cargar los productos destacados: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/producto/${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos destacados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-red-100 rounded-lg">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block">Bienvenido a UADE Commerce</span>
              <span className="block text-blue-200">Tu tienda en línea de confianza</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-blue-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Descubre los mejores productos a los mejores precios. Envíos a todo el país.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  to="/productos"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Ver productos
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                  to="/register"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 md:py-4 md:text-lg md:px-10"
                >
                  Crear cuenta
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Productos Destacados
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Los productos más populares de nuestra tienda
          </p>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {featuredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={() => {}}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay productos destacados disponibles en este momento.</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/productos"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Ver todos los productos
            <svg
              className="ml-2 -mr-1 w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Características</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Una mejor manera de comprar en línea
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Productos de calidad</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Ofrecemos solo productos de la mejor calidad de vendedores verificados.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Envío rápido</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Recibe tus productos en la puerta de tu casa en tiempo récord.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Pago seguro</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Procesamos tus pagos de forma segura con los más altos estándares de encriptación.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">¿Listo para comenzar?</span>
            <span className="block">Regístrate hoy mismo.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            Únete a nuestra comunidad de compradores satisfechos y descubre ofertas increíbles.
          </p>
          <Link
            to="/register"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto"
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Inicio;
