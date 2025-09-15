const fs = require('fs');
const path = require('path');

// List of files to update
const filesToUpdate = [
  'src/pages/Register.jsx',
  'src/pages/PublishProduct.jsx',
  'src/pages/PerfilUser.jsx',
  'src/pages/MisProductos.jsx',
  'src/pages/MisCompras.jsx',
  'src/pages/Login.jsx',
  'src/pages/Inicio.jsx',
  'src/pages/DetalleProducto.jsx',
  'src/pages/Checkout.jsx',
  'src/pages/Carrito.jsx',
  'src/components/ProductCard.jsx',
  'src/components/PrivateRoute.jsx',
  'src/components/Header.jsx',
  'src/App.jsx'
];

// Update imports in each file
filesToUpdate.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Update AuthContext import
    content = content.replace(
      /from ['"]\.\.\/context\/AuthContext['"]/g,
      'from "../context/AuthContext.jsx"'
    );
    
    // Update CartContext import
    content = content.replace(
      /from ['"]\.\.\/context\/CartContext['"]/g,
      'from "../context/CartContext.jsx"'
    );
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated imports in ${filePath}`);
  } else {
    console.warn(`File not found: ${filePath}`);
  }
});

console.log('All imports have been updated!');
