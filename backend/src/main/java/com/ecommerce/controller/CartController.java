package com.ecommerce.controller;

import com.ecommerce.dto.AddToCartRequestDTO;
import com.ecommerce.dto.CartItemDTO;
import com.ecommerce.dto.CheckoutResponseDTO;
import com.ecommerce.dto.UpdateCartItemRequestDTO;
import com.ecommerce.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItemDTO>> getCart(Authentication authentication) {
        String email = authentication.getName();
        List<CartItemDTO> items = cartService.getCart(email);
        return ResponseEntity.ok(items);
    }

    @PostMapping("/add")
    public ResponseEntity<Map<String, String>> addToCart(@RequestBody AddToCartRequestDTO request, Authentication authentication) {
        String email = authentication.getName();
        cartService.addToCart(email, request);
        return ResponseEntity.ok(Map.of("message", "Producto agregado al carrito"));
    }

    @PutMapping("/update/{itemId}")
    public ResponseEntity<Map<String, String>> updateCartItem(@PathVariable Long itemId, @RequestBody UpdateCartItemRequestDTO request, Authentication authentication) {
        String email = authentication.getName();
        cartService.updateCartItem(email, itemId, request);
        return ResponseEntity.ok(Map.of("message", "Cantidad actualizada"));
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<Map<String, String>> removeFromCart(@PathVariable Long itemId, Authentication authentication) {
        String email = authentication.getName();
        cartService.removeFromCart(email, itemId);
        return ResponseEntity.ok(Map.of("message", "Producto eliminado del carrito"));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Map<String, String>> clearCart(Authentication authentication) {
        String email = authentication.getName();
        cartService.clearCart(email);
        return ResponseEntity.ok(Map.of("message", "Carrito vaciado"));
    }

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponseDTO> checkout(Authentication authentication) {
        String email = authentication.getName();
        CheckoutResponseDTO response = cartService.checkout(email);
        return ResponseEntity.ok(response);
    }
}
