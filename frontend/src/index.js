// Importar React para crear componentes
import React from "react";
// Importar ReactDOM para renderizar la aplicación en el DOM
import ReactDOM from "react-dom/client";
// Importar estilos CSS globales de la aplicación
import "./index.css";
// Importar el componente principal de la aplicación
import App from "./App";

// Crear el punto de montaje de React en el elemento con id "root" del HTML
const root = ReactDOM.createRoot(document.getElementById("root"));
// Renderizar la aplicación dentro de React.StrictMode para detectar problemas potenciales
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
