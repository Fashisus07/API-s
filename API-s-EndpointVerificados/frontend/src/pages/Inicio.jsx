// Importar React y hooks necesarios para la página de inicio
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Hooks para navegación
import { useAuth } from "../context/AuthContext"; // Contexto de autenticación
import ProductCard from "../components/ProductCard"; // Componente de tarjeta de producto
import { getCategories, getProducts } from "../services/apiService"; // Servicios para obtener datos del backend

// Componente Inicio - Página principal de la aplicación
function Inicio() {
  const { isAuthenticated, user } = useAuth(); // Obtener estado de autenticación y datos del usuario
  const navigate = useNavigate(); // Hook para navegación programática
  const [featuredProducts, setFeaturedProducts] = useState([]); // Estado para productos destacados
  const [categories, setCategories] = useState([]); // Estado para categorías dinámicas
  const [loading, setLoading] = useState(true); // Estado de carga

  // useEffect para cargar productos desde el backend
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const productsData = await getProducts();
        
        // Seleccionar los primeros 8 productos con stock disponible como destacados
        const featured = productsData.filter(p => (p.stock ?? 0) > 0).slice(0, 8);
        setFeaturedProducts(featured);
        console.log("Inicio - Productos cargados desde backend:", productsData.length);
      } catch (error) {
        console.error("Error cargando productos:", error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
    // Escuchar eventos que indiquen cambio en productos (ej. checkout)
    const onProductsUpdated = () => {
      console.log('Evento productsUpdated recibido en Inicio — recargando destacados');
      loadProducts();
    };
    window.addEventListener('productsUpdated', onProductsUpdated);
    return () => window.removeEventListener('productsUpdated', onProductsUpdated);
  }, []);

  // useEffect para cargar categorías desde el backend
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await getCategories();
        
        // Mapear categorías del backend con íconos y colores
        // Función local para generar slugs de categoría (coincide con lo que usa Productos para filtrar)
        const slugify = (str) => {
          return str?.toString()?.trim()?.normalize('NFD')?.replace(/\p{Diacritic}/gu, '')?.toLowerCase()?.replace(/\s+/g, '-')?.replace(/[^a-z0-9\-]/g, '') || '';
        };

        const categoriesWithIcons = categoriesData.map((category, index) => {
          // Asignar ícono según el nombre de la categoría
          const iconMap = {
            'electronicos': '📱',
            'electrónicos': '📱',
            'ropa': '👕',
            'hogar': '🏠',
            'deportes': '⚽',
            'libros': '📚',
            'belleza': '💄',
            'calzado': '👟',
            'juguetes': '🧸',
            'alimentos': '🍕',
            'muebles': '🛋️',
            'tecnologia': '💻',
            'tecnología': '💻',
            'electronica': '📱',
            'electrónica': '📱',
            'accesorios': '👜',
            'joyeria': '💍',
            'joyería': '💍',
            'mascotas': '🐾',
            'jardin': '🌿',
            'jardín': '🌿',
            'automotriz': '🚗',
            'herramientas': '🔧',
            'musica': '🎵',
            'música': '🎵',
            'instrumentos': '🎸',
            'videojuegos': '🎮',
            'peliculas': '🎬',
            'películas': '🎬',
            'salud': '💊',
            'bebes': '👶',
            'bebés': '👶',
            'oficina': '📎',
            'arte': '🎨',
            'cocina': '🍳',
            'camping': '⛺',
            'fitness': '💪'
          };
          
          // Asignar colores de forma cíclica
          const colors = [
            'bg-blue-100',
            'bg-pink-100',
            'bg-green-100',
            'bg-orange-100',
            'bg-purple-100',
            'bg-red-100',
            'bg-yellow-100',
            'bg-indigo-100',
            'bg-teal-100',
            'bg-cyan-100'
          ];
          
          const categoryNameLower = category.name.toLowerCase();
          const icon = iconMap[categoryNameLower] || '📦'; // Ícono por defecto
          const color = colors[index % colors.length]; // Color cíclico
          
          return {
            id: category.id,
            name: category.name,
            icon: icon,
            color: color,
            // usamos slug (nombre normalizado) para el parámetro 'category' que luego filtra Productos
            link: `/productos?category=${slugify(category.name)}`
          };
        });
        
        setCategories(categoriesWithIcons);
      } catch (error) {
        console.error('Error cargando categorías:', error);
        // Si falla, usar categorías por defecto
        setCategories([
          { name: "Electrónicos", icon: "📱", color: "bg-blue-100", link: "/productos?category=electronicos" },
          { name: "Ropa", icon: "👕", color: "bg-pink-100", link: "/productos?category=ropa" },
          { name: "Hogar", icon: "🏠", color: "bg-green-100", link: "/productos?category=hogar" }
        ]);
      }
    };
    
    loadCategories();
  }, []);

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
