package com.ecommerce.service;

import com.ecommerce.dto.*;
import com.ecommerce.exception.*;
import com.ecommerce.model.CartItem;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<CartItemDTO> getCart(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        
        List<CartItem> items = cartItemRepository.findByUser(user);
        return items.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void addToCart(String email, AddToCartRequestDTO request) {
        if (request.getQuantity() <= 0) {
            throw new InvalidDataException("La cantidad debe ser mayor a 0");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

        if (product.getStock() < request.getQuantity()) {
            throw new InsufficientStockException("Stock insuficiente");
        }

        List<CartItem> existingItems = cartItemRepository.findByUser(user);
        CartItem existingItem = existingItems.stream()
                .filter(item -> item.getProduct().getId().equals(request.getProductId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            int totalQuantity = existingItem.getQuantity() + request.getQuantity();
            if (product.getStock() < totalQuantity) {
                throw new InsufficientStockException("Stock insuficiente para la cantidad total");
            }
            existingItem.setQuantity(totalQuantity);
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem();
            newItem.setUser(user);
            newItem.setProduct(product);
            newItem.setQuantity(request.getQuantity());
            cartItemRepository.save(newItem);
        }
    }

    @Transactional
    public void updateCartItem(String email, Long itemId, UpdateCartItemRequestDTO request) {
        if (request.getQuantity() <= 0) {
            throw new InvalidDataException("La cantidad debe ser mayor a 0");
        }

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item no encontrado"));

        if (!item.getUser().getEmail().equals(email)) {
            throw new UnauthorizedException("No autorizado");
        }

        if (item.getProduct().getStock() < request.getQuantity()) {
            throw new InsufficientStockException("Stock insuficiente");
        }

        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);
    }

    @Transactional
    public void removeFromCart(String email, Long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item no encontrado"));

        if (!item.getUser().getEmail().equals(email)) {
            throw new UnauthorizedException("No autorizado");
        }

        cartItemRepository.delete(item);
    }

    @Transactional
    public void clearCart(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        
        cartItemRepository.deleteByUser(user);
    }

    @Transactional
    public CheckoutResponseDTO checkout(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        
        List<CartItem> items = cartItemRepository.findByUser(user);
        
        if (items.isEmpty()) {
            throw new InvalidDataException("El carrito está vacío");
        }

        for (CartItem item : items) {
            if (item.getProduct().getStock() < item.getQuantity()) {
                throw new InsufficientStockException("Stock insuficiente para " + item.getProduct().getName());
            }
        }

        double total = 0;
        for (CartItem item : items) {
            Product product = item.getProduct();
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
            total += product.getPrice() * item.getQuantity();
        }

        cartItemRepository.deleteByUser(user);

        return new CheckoutResponseDTO("Compra realizada exitosamente", total, items.size());
    }

    private CartItemDTO convertToDTO(CartItem item) {
        ProductDTO productDTO = new ProductDTO(
            item.getProduct().getId(),
            item.getProduct().getName(),
            item.getProduct().getDescription(),
            item.getProduct().getPrice(),
            item.getProduct().getStock(),
            item.getProduct().getCategory(),
            item.getProduct().getImageUrl()
        );
        return new CartItemDTO(item.getId(), productDTO, item.getQuantity());
    }
}
