import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import DetalleProducto from "./pages/DetalleProducto";
import Carrito from "./pages/Carrito";
import Checkout from "./pages/Checkout";
import PerfilUser from "./pages/PerfilUser";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PublishProduct from "./pages/PublishProduct";
import MisCompras from "./pages/MisCompras";
import MisProductos from "./pages/MisProductos";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1 p-4">
              <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/inicio" element={<Inicio />} />
                <Route path="/productos" element={<Productos />} />
                <Route path="/mis-compras" element={<PrivateRoute><MisCompras /></PrivateRoute>} />
                <Route path="/mis-productos" element={<PrivateRoute><MisProductos /></PrivateRoute>} />
                <Route path="/producto/:id" element={<DetalleProducto />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/carrito"
                  element={
                    <PrivateRoute>
                      <Carrito />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <PrivateRoute>
                      <Checkout />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/perfil"
                  element={
                    <PrivateRoute>
                      <PerfilUser />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/publish"
                  element={
                    <PrivateRoute>
                      <PublishProduct />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
