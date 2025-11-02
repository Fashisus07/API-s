import React from "react";

function Footer() {
  return (
    <footer className="bg-primary text-secondary shadow p-4 text-center mt-8">
      &copy; {new Date().getFullYear()} UADE-Commerce Oficial - Todos los derechos reservados
    </footer>
  );
}

export default Footer;
