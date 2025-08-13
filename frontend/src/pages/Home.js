import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import ProductCard from "../components/ProductCard";

function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await api.get("/products");
        // Mostrar solo los primeros 4 productos como destacados
        setFeaturedProducts(res.data.slice(0, 4));
      } catch (err) {
        console.error("Error al cargar productos destacados:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const categories = [
    { name: "Electrónicos", icon: "📱", color: "bg-blue-100", link: "/products?category=electronicos" },
    { name: "Ropa", icon: "👕", color: "bg-pink-100", link: "/products?category=ropa" },
    { name: "Hogar", icon: "🏠", color: "bg-green-100", link: "/products?category=hogar" },
    { name: "Deportes", icon: "⚽", color: "bg-orange-100", link: "/products?category=deportes" },
    { name: "Libros", icon: "📚", color: "bg-purple-100", link: "/products?category=libros" },
    { name: "Belleza", icon: "💄", color: "bg-red-100", link: "/products?category=belleza" }
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
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
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
                to="/products"
                className="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent-dark transition-colors text-lg shadow-lg"
              >
                Explorar productos
              </Link>
              <Link
                to={isAuthenticated() ? "/cart" : "/login"}
                className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-lg shadow-lg flex items-center"
              >
                <span className="mr-2">🛒</span> {isAuthenticated() ? "Ver mi carrito" : "Ir al carrito"}
              </Link>
              {!isAuthenticated() && (
                <Link
                  to="/register"
                  className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors text-lg shadow-lg"
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
          <h2 className="text-3xl font-bold text-center mb-12 text-secondary">
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
            <h2 className="text-3xl font-bold text-secondary">
              Productos destacados
            </h2>
            <Link
              to="/products"
              className="text-primary hover:text-primary-dark font-semibold flex items-center"
            >
              Ver todos →
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors shadow-md"
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
            <h2 className="text-3xl font-bold mb-6 text-secondary">
              ¡Hola, {user?.name}! 🚀
            </h2>
            <p className="text-xl mb-8 text-gray-600">
              Accede rápidamente a tus funciones favoritas
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                to="/cart"
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-blue-100 hover:border-primary group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🛒</div>
                <h3 className="font-semibold text-lg mb-2 text-primary">Mi Carrito</h3>
                <p className="text-gray-600 text-sm">Ver productos agregados y finalizar compra</p>
              </Link>
              <Link
                to="/publish"
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-blue-100 hover:border-primary group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📦</div>
                <h3 className="font-semibold text-lg mb-2 text-primary">Vender</h3>
                <p className="text-gray-600 text-sm">Publica tus productos y comienza a vender</p>
              </Link>
              <Link
                to="/products"
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-blue-100 hover:border-primary group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🔍</div>
                <h3 className="font-semibold text-lg mb-2 text-primary">Explorar</h3>
                <p className="text-gray-600 text-sm">Descubre nuevos productos y ofertas</p>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-secondary">
            ¿Por qué elegir UADE-Commerce?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center bg-blue-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-blue-100">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="font-semibold text-lg mb-2 text-primary">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
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
              className="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent-dark transition-colors text-lg shadow-lg"
            >
              Vender ahora
            </Link>
          ) : (
            <div className="space-x-4">
              <Link
                to="/register"
                className="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent-dark transition-colors text-lg shadow-lg"
              >
                Crear cuenta
              </Link>
              <Link
                to="/login"
                className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-lg shadow-lg"
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

export default Home;
