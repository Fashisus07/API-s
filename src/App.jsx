import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import CartProvider from "./context/CartProvider.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Inicio from "./pages/Inicio.jsx";
import Productos from "./pages/Productos.jsx";
import DetalleProducto from "./pages/DetalleProducto.jsx";
import Carrito from "./pages/Carrito.jsx";
import Checkout from "./pages/Checkout.jsx";
import PerfilUser from "./pages/PerfilUser.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import PublishProduct from "./pages/PublishProduct.jsx";
import MisCompras from "./pages/MisCompras.jsx";
import MisProductos from "./pages/MisProductos.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/productos" element={<Productos />} />
                <Route path="/producto/:id" element={<DetalleProducto />} />
                <Route path="/carrito" element={<Carrito />} />
                
                {/* Protected Routes */}
                <Route path="/checkout" element={
                  <PrivateRoute>
                    <Checkout />
                  </PrivateRoute>
                } />
                
                <Route path="/perfil" element={
                  <PrivateRoute>
                    <PerfilUser />
                  </PrivateRoute>
                } />
                
                <Route path="/publicar-producto" element={
                  <PrivateRoute>
                    <PublishProduct />
                  </PrivateRoute>
                } />
                
                <Route path="/mis-compras" element={
                  <PrivateRoute>
                    <MisCompras />
                  </PrivateRoute>
                } />
                
                <Route path="/mis-productos" element={
                  <PrivateRoute>
                    <MisProductos />
                  </PrivateRoute>
                } />
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Register />} />
                
                {/* 404 - Not Found */}
                <Route path="*" element={
                  <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                      <p className="text-xl text-gray-600 mb-6">Página no encontrada</p>
                      <a 
                        href="/" 
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Volver al inicio
                      </a>
                    </div>
                  </div>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
