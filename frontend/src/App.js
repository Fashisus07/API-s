// Importar React para crear componentes
import React from "react";
// Importar componentes de React Router para navegación y enrutamiento
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Importar proveedores de contexto para autenticación y carrito
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
// Importar componente para rutas protegidas que requieren autenticación
import PrivateRoute from "./components/PrivateRoute";
// Importar componentes de layout (cabecera y pie de página)
import Header from "./components/Header";
import Footer from "./components/Footer";
// Importar todas las páginas de la aplicación
import Inicio from "./pages/Inicio"; // Página de inicio/home
import Productos from "./pages/Productos"; // Página de listado de productos
import DetalleProducto from "./pages/DetalleProducto"; // Página de detalle individual de producto
import Carrito from "./pages/Carrito"; // Página del carrito de compras
import Checkout from "./pages/Checkout"; // Página de finalización de compra
import PerfilUser from "./pages/PerfilUser"; // Página de perfil de usuario
import Login from "./pages/Login"; // Página de inicio de sesión
import Register from "./pages/Register"; // Página de registro de usuario
import PublishProduct from "./pages/PublishProduct"; // Página para publicar/vender productos
import MisCompras from "./pages/MisCompras"; // Página de historial de compras del usuario
import MisProductos from "./pages/MisProductos"; // Página de productos publicados por el usuario

// Componente principal de la aplicación que define la estructura y rutas
function App() {
  return (
    // Proveedor de contexto de autenticación - maneja el estado de login/logout globalmente
    <AuthProvider>
      {/* Proveedor de contexto del carrito - maneja el estado del carrito globalmente */}
      <CartProvider>
        {/* Router principal que habilita la navegación entre páginas */}
        <Router>
          {/* Contenedor principal con altura mínima de pantalla completa y layout flex */}
          <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Componente de cabecera que se muestra en todas las páginas */}
            <Header />
            {/* Contenido principal que ocupa el espacio restante */}
            <main className="flex-1 p-4">
              {/* Definición de todas las rutas de la aplicación */}
              <Routes>
                {/* Ruta raíz que muestra la página de inicio */}
                <Route path="/" element={<Inicio />} />
                {/* Ruta alternativa para la página de inicio */}
                <Route path="/inicio" element={<Inicio />} />
                {/* Ruta para el listado de productos (pública) */}
                <Route path="/productos" element={<Productos />} />
                {/* Ruta protegida para ver las compras del usuario */}
                <Route path="/mis-compras" element={<PrivateRoute><MisCompras /></PrivateRoute>} />
                {/* Ruta protegida para ver los productos publicados por el usuario */}
                <Route path="/mis-productos" element={<PrivateRoute><MisProductos /></PrivateRoute>} />
                {/* Ruta dinámica para ver detalles de un producto específico (por ID) */}
                <Route path="/producto/:id" element={<DetalleProducto />} />
                {/* Ruta para la página de inicio de sesión */}
                <Route path="/login" element={<Login />} />
                {/* Ruta para la página de registro de nuevos usuarios */}
                <Route path="/register" element={<Register />} />
                {/* Ruta protegida para el carrito de compras */}
                <Route
                  path="/carrito"
                  element={
                    <PrivateRoute>
                      <Carrito />
                    </PrivateRoute>
                  }
                />
                {/* Ruta protegida para el proceso de checkout/finalización de compra */}
                <Route
                  path="/checkout"
                  element={
                    <PrivateRoute>
                      <Checkout />
                    </PrivateRoute>
                  }
                />
                {/* Ruta protegida para el perfil de usuario */}
                <Route
                  path="/perfil"
                  element={
                    <PrivateRoute>
                      <PerfilUser />
                    </PrivateRoute>
                  }
                />
                {/* Ruta protegida para publicar/vender productos */}
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
            {/* Componente de pie de página que se muestra en todas las páginas */}
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
