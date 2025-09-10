package com.ecommerce.controller;

import com.ecommerce.model.CartItem;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    // Obtener carrito del usuario autenticado
    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(Authentication authentication) {
        String email = authentication.getName();
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            List<CartItem> items = cartItemRepository.findByUser(user.get());
            return ResponseEntity.ok(items);
        }
        return ResponseEntity.badRequest().build();
    }

    // Agregar producto al carrito
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Object> request, Authentication authentication) {
        String email = authentication.getName();
        Long productId = Long.valueOf(request.get("productId").toString());
        Integer quantity = Integer.valueOf(request.get("quantity").toString());

        if (quantity <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "La cantidad debe ser mayor a 0"));
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        Optional<Product> productOpt = productRepository.findById(productId);

        if (userOpt.isPresent() && productOpt.isPresent()) {
            User user = userOpt.get();
            Product product = productOpt.get();

            // Verificar stock disponible
            if (product.getStock() < quantity) {
                return ResponseEntity.badRequest().body(Map.of("error", "Stock insuficiente"));
            }

            // Verificar si ya existe en el carrito
            List<CartItem> existingItems = cartItemRepository.findByUser(user);
            CartItem existingItem = existingItems.stream()
                    .filter(item -> item.getProduct().getId().equals(productId))
                    .findFirst()
                    .orElse(null);

            if (existingItem != null) {
                // Verificar stock total (existente + nuevo)
                int totalQuantity = existingItem.getQuantity() + quantity;
                if (product.getStock() < totalQuantity) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Stock insuficiente para la cantidad total"));
                }
                existingItem.setQuantity(totalQuantity);
                cartItemRepository.save(existingItem);
            } else {
                // Crear nuevo item
                CartItem newItem = new CartItem();
                newItem.setUser(user);
                newItem.setProduct(product);
                newItem.setQuantity(quantity);
                cartItemRepository.save(newItem);
            }

            return ResponseEntity.ok(Map.of("message", "Producto agregado al carrito"));
        }

        return ResponseEntity.badRequest().body(Map.of("error", "Usuario o producto no encontrado"));
    }

    // Actualizar cantidad de un item del carrito
    @PutMapping("/update/{itemId}")
    public ResponseEntity<?> updateCartItem(@PathVariable Long itemId, @RequestBody Map<String, Object> request, Authentication authentication) {
        String email = authentication.getName();
        Integer newQuantity = Integer.valueOf(request.get("quantity").toString());

        if (newQuantity <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "La cantidad debe ser mayor a 0"));
        }

        Optional<CartItem> itemOpt = cartItemRepository.findById(itemId);
        if (itemOpt.isPresent()) {
            CartItem item = itemOpt.get();
            
            // Verificar que el item pertenece al usuario autenticado
            if (!item.getUser().getEmail().equals(email)) {
                return ResponseEntity.status(403).body(Map.of("error", "No autorizado"));
            }

            // Verificar stock
            if (item.getProduct().getStock() < newQuantity) {
                return ResponseEntity.badRequest().body(Map.of("error", "Stock insuficiente"));
            }

            item.setQuantity(newQuantity);
            cartItemRepository.save(item);
            return ResponseEntity.ok(Map.of("message", "Cantidad actualizada"));
        }

        return ResponseEntity.badRequest().body(Map.of("error", "Item no encontrado"));
    }

    // Eliminar item del carrito
    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long itemId, Authentication authentication) {
        String email = authentication.getName();
        
        Optional<CartItem> itemOpt = cartItemRepository.findById(itemId);
        if (itemOpt.isPresent()) {
            CartItem item = itemOpt.get();
            
            // Verificar que el item pertenece al usuario autenticado
            if (!item.getUser().getEmail().equals(email)) {
                return ResponseEntity.status(403).body(Map.of("error", "No autorizado"));
            }

            cartItemRepository.delete(item);
            return ResponseEntity.ok(Map.of("message", "Producto eliminado del carrito"));
        }

        return ResponseEntity.badRequest().body(Map.of("error", "Item no encontrado"));
    }

    // Vaciar carrito completo
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(Authentication authentication) {
        String email = authentication.getName();
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            cartItemRepository.deleteByUser(user.get());
            return ResponseEntity.ok(Map.of("message", "Carrito vaciado"));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Usuario no encontrado"));
    }

    // Checkout - Finalizar compra
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(Authentication authentication) {
        String email = authentication.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            List<CartItem> items = cartItemRepository.findByUser(user);
            
            if (items.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El carrito está vacío"));
            }

            // Verificar stock de todos los productos
            for (CartItem item : items) {
                if (item.getProduct().getStock() < item.getQuantity()) {
                    return ResponseEntity.badRequest().body(Map.of(
                        "error", "Stock insuficiente para " + item.getProduct().getName()
                    ));
                }
            }

            // Actualizar stock y limpiar carrito
            double total = 0;
            for (CartItem item : items) {
                Product product = item.getProduct();
                product.setStock(product.getStock() - item.getQuantity());
                productRepository.save(product);
                total += product.getPrice() * item.getQuantity();
            }

            cartItemRepository.deleteByUser(user);

            return ResponseEntity.ok(Map.of(
                "message", "Compra realizada exitosamente",
                "total", total,
                "items", items.size()
            ));
        }

        return ResponseEntity.badRequest().body(Map.of("error", "Usuario no encontrado"));
    }
}
