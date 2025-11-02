package com.ecommerce.controller;

import com.ecommerce.dto.*;
import com.ecommerce.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItemDTO>> getCart(Authentication authentication) {
        String email = authentication.getName();
        List<CartItemDTO> cartItems = cartService.getCartByUserEmail(email);
        return ResponseEntity.ok(cartItems);
    }

    @PostMapping("/add")
    public ResponseEntity<CartItemDTO> addToCart(@Valid @RequestBody AddToCartDTO addToCartDTO, 
                                                Authentication authentication) {
        String email = authentication.getName();
        CartItemDTO cartItem = cartService.addToCart(email, addToCartDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(cartItem);
    }

    @PutMapping("/update/{itemId}")
    public ResponseEntity<CartItemDTO> updateCartItem(@PathVariable Long itemId, 
                                                     @Valid @RequestBody UpdateCartItemDTO updateCartItemDTO,
                                                     Authentication authentication) {
        String email = authentication.getName();
        CartItemDTO updatedItem = cartService.updateCartItem(email, itemId, updateCartItemDTO);
        return ResponseEntity.ok(updatedItem);
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long itemId, Authentication authentication) {
        String email = authentication.getName();
        cartService.removeFromCart(email, itemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        String email = authentication.getName();
        cartService.clearCart(email);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponseDTO> checkout(Authentication authentication) {
        String email = authentication.getName();
        CheckoutResponseDTO response = cartService.checkout(email);
        return ResponseEntity.ok(response);
    }
}
