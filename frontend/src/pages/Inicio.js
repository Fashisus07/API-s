// Importar React y hooks necesarios para la página de inicio
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Hooks para navegación
import { useAuth } from "../context/AuthContext"; // Contexto de autenticación
import ProductCard from "../components/ProductCard"; // Componente de tarjeta de producto
import productsData from "../data/bs.json"; // Datos de productos desde archivo JSON

// Componente Inicio - Página principal de la aplicación
function Inicio() {
  const { isAuthenticated, user } = useAuth(); // Obtener estado de autenticación y datos del usuario
  const navigate = useNavigate(); // Hook para navegación programática
  const [featuredProducts, setFeaturedProducts] = useState([]); // Estado para productos destacados
  const [loading, setLoading] = useState(true); // Estado de carga

  // useEffect para cargar productos al montar el componente
  useEffect(() => {
    console.log("Inicio - useEffect ejecutándose...");
    console.log("Inicio - productsData:", productsData);

    // Inicializar lista de productos con datos del JSON principal
    let allProductsList = [];
    if (productsData && productsData.products) {
      allProductsList = [...productsData.products]; // Copiar productos del JSON
    }

    // Verificar y cargar productos adicionales desde localStorage (productos publicados por usuarios)
    try {
      const userProducts = JSON.parse(localStorage.getItem('userProducts') || '[]');
      if (userProducts.length > 0) {
        // Filtrar solo productos activos para mostrar en la página principal
        const activeUserProducts = userProducts.filter(p => p.status === 'active');
        // Combinar productos del JSON con productos de usuarios, evitando duplicados por ID
        const existingIds = allProductsList.map(p => p.id);
        const newProducts = activeUserProducts.filter(p => !existingIds.includes(p.id));
        allProductsList = [...allProductsList, ...newProducts];
      }

      // Verificar también allProductsData por compatibilidad con versiones anteriores
      const savedProductsData = localStorage.getItem('allProductsData');
      if (savedProductsData) {
        const parsedData = JSON.parse(savedProductsData);
        if (parsedData.products) {
          // Evitar duplicados al agregar productos guardados
          const existingIds = allProductsList.map(p => p.id);
          const newProducts = parsedData.products.filter(p => !existingIds.includes(p.id));
          allProductsList = [...allProductsList, ...newProducts];
        }
      }
    } catch (error) {
      console.log("Error cargando productos adicionales:", error);
    }

    // Seleccionar los primeros 8 productos como destacados para mostrar en la página principal
    const featured = allProductsList.slice(0, 8);
    setFeaturedProducts(featured);
    console.log("Inicio - Productos cargados:", allProductsList.length);
    setLoading(false);
  }, []);

  const categories = [
    { name: "Electrónicos", icon: "📱", color: "bg-blue-100", link: "/productos?category=electronicos" },
    { name: "Ropa", icon: "👕", color: "bg-pink-100", link: "/productos?category=ropa" },
    { name: "Hogar", icon: "🏠", color: "bg-green-100", link: "/productos?category=hogar" },
    { name: "Deportes", icon: "⚽", color: "bg-orange-100", link: "/productos?category=deportes" },
    { name: "Libros", icon: "📚", color: "bg-purple-100", link: "/productos?category=libros" },
    { name: "Belleza", icon: "💄", color: "bg-red-100", link: "/productos?category=belleza" }
  ];

  const benefits = [
    {
      icon: "🚚",
      title: "Envío gratis",
      description: "En compras superiores a $25.000"
    },
    {
      icon: "🔒",
      title: "Compra protegida",
      description: "Recibí el producto que esperabas o te devolvemos tu dinero"
    },
    {
      icon: "💳",
      title: "Pagá como quieras",
      description: "Tarjeta de crédito, débito, efectivo o cuotas sin interés"
    },
    {
      icon: "📞",
      title: "Soporte 24/7",
      description: "Estamos aquí para ayudarte cuando lo necesites"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Comprá y vendé todo lo que necesitás
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Miles de productos con envío gratis y la mejor experiencia de compra
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/productos"
                className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-lg shadow-lg"
              >
                Explorar productos
              </Link>
              <Link
                to={isAuthenticated() ? "/carrito" : "/login"}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-lg shadow-lg flex items-center"
              >
                <span className="mr-2">🛒</span> {isAuthenticated() ? "Ver mi carrito" : "Ir al carrito"}
              </Link>
              {!isAuthenticated() && (
                <Link
                  to="/register"
                  className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors text-lg shadow-lg"
                >
                  Crear cuenta gratis
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Explorá por categorías
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className={`${category.color} p-6 rounded-xl text-center hover:scale-105 transition-transform shadow-md hover:shadow-lg`}
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-700">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">
              {isAuthenticated() ? "Todos los productos" : "Productos destacados"}
            </h2>
            {!isAuthenticated() && (
              <Link
                to="/productos"
                className="text-blue-600 hover:text-blue-800 font-semibold flex items-center"
              >
                Ver todos →
              </Link>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className={`grid gap-6 ${isAuthenticated() ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Aún no hay productos destacados
              </h3>
              <p className="text-gray-500 mb-6">
                ¡Sé el primero en publicar un producto!
              </p>
              {isAuthenticated() && (
                <Link
                  to="/publish"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  Publicar producto
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Quick Access Section for Authenticated Users */}
      {isAuthenticated() && (
        <section className="py-16 bg-blue-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              ¡Hola, {user?.name}! 🚀
            </h2>
            <p className="text-xl mb-8 text-gray-600">
              Accede rápidamente a tus funciones favoritas
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                to="/carrito"
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-blue-100 hover:border-blue-600 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🛒</div>
                <h3 className="font-semibold text-lg mb-2 text-blue-600">Mi Carrito</h3>
                <p className="text-gray-600 text-sm">Ver productos agregados y finalizar compra</p>
              </Link>
              <Link
                to="/publish"
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-blue-100 hover:border-blue-600 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📦</div>
                <h3 className="font-semibold text-lg mb-2 text-blue-600">Vender</h3>
                <p className="text-gray-600 text-sm">Publica tus productos y comienza a vender</p>
              </Link>
              <Link
                to="/perfil"
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-blue-100 hover:border-blue-600 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">👤</div>
                <h3 className="font-semibold text-lg mb-2 text-blue-600">Mi Perfil</h3>
                <p className="text-gray-600 text-sm">Gestiona tu información personal</p>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            ¿Por qué elegir UADE-Commerce?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center bg-blue-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-blue-100">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="font-semibold text-lg mb-2 text-blue-600">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            ¿Tenés algo para vender?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Publicá gratis y llegá a miles de compradores
          </p>
          {isAuthenticated() ? (
            <Link
              to="/publish"
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-lg shadow-lg"
            >
              Vender ahora
            </Link>
          ) : (
            <div className="space-x-4">
              <Link
                to="/register"
                className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-lg shadow-lg"
              >
                Crear cuenta
              </Link>
              <Link
                to="/login"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-lg shadow-lg"
              >
                Iniciar sesión
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Inicio;
