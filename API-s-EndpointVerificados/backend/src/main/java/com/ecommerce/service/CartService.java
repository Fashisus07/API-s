package com.ecommerce.service;

import com.ecommerce.dto.*;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.exception.UnauthorizedException;
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

    public List<CartItemDTO> getCartByUserEmail(String email) {
        User user = getUserByEmail(email);
        List<CartItem> items = cartItemRepository.findByUser(user);
        return items.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public CartItemDTO addToCart(String email, AddToCartDTO addToCartDTO) {
        User user = getUserByEmail(email);
        Product product = productRepository.findById(addToCartDTO.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", addToCartDTO.getProductId()));

        if (product.getStock() < addToCartDTO.getQuantity()) {
            throw new BadRequestException("Stock insuficiente");
        }

        List<CartItem> existingItems = cartItemRepository.findByUser(user);
        CartItem existingItem = existingItems.stream()
                .filter(item -> item.getProduct().getId().equals(addToCartDTO.getProductId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            int totalQuantity = existingItem.getQuantity() + addToCartDTO.getQuantity();
            if (product.getStock() < totalQuantity) {
                throw new BadRequestException("Stock insuficiente para la cantidad total");
            }
            existingItem.setQuantity(totalQuantity);
            CartItem savedItem = cartItemRepository.save(existingItem);
            return convertToDTO(savedItem);
        } else {
            CartItem newItem = new CartItem();
            newItem.setUser(user);
            newItem.setProduct(product);
            newItem.setQuantity(addToCartDTO.getQuantity());
            CartItem savedItem = cartItemRepository.save(newItem);
            return convertToDTO(savedItem);
        }
    }

    @Transactional
    public CartItemDTO updateCartItem(String email, Long itemId, UpdateCartItemDTO updateCartItemDTO) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item del carrito", "id", itemId));

        if (!item.getUser().getEmail().equals(email)) {
            throw new UnauthorizedException("No autorizado para modificar este item");
        }

        if (item.getProduct().getStock() < updateCartItemDTO.getQuantity()) {
            throw new BadRequestException("Stock insuficiente");
        }

        item.setQuantity(updateCartItemDTO.getQuantity());
        CartItem savedItem = cartItemRepository.save(item);
        return convertToDTO(savedItem);
    }

    @Transactional
    public void removeFromCart(String email, Long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item del carrito", "id", itemId));

        if (!item.getUser().getEmail().equals(email)) {
            throw new UnauthorizedException("No autorizado para eliminar este item");
        }

        cartItemRepository.delete(item);
    }

    @Transactional
    public void clearCart(String email) {
        User user = getUserByEmail(email);
        cartItemRepository.deleteByUser(user);
    }

    @Transactional
    public CheckoutResponseDTO checkout(String email) {
        User user = getUserByEmail(email);
        List<CartItem> items = cartItemRepository.findByUser(user);

        if (items.isEmpty()) {
            throw new BadRequestException("El carrito está vacío");
        }

        for (CartItem item : items) {
            if (item.getProduct().getStock() < item.getQuantity()) {
                throw new BadRequestException("Stock insuficiente para " + item.getProduct().getName());
            }
        }

        double total = 0;
        for (CartItem item : items) {
            Product product = item.getProduct();
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
            total += product.getPrice() * item.getQuantity();
        }

        int itemsCount = items.size();
        cartItemRepository.deleteByUser(user);

        return new CheckoutResponseDTO("Compra realizada exitosamente", total, itemsCount);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "email", email));
    }

    private CartItemDTO convertToDTO(CartItem cartItem) {
        ProductDTO productDTO = new ProductDTO(
                cartItem.getProduct().getId(),
                cartItem.getProduct().getName(),
                cartItem.getProduct().getDescription(),
                cartItem.getProduct().getPrice(),
                cartItem.getProduct().getStock(),
                cartItem.getProduct().getCategory(),
                cartItem.getProduct().getImageUrl()
        );

        double subtotal = cartItem.getProduct().getPrice() * cartItem.getQuantity();

        return new CartItemDTO(
                cartItem.getId(),
                productDTO,
                cartItem.getQuantity(),
                subtotal
        );
    }
}
