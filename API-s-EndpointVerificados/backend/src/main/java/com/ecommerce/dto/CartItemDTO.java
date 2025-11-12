package com.ecommerce.dto;

public class CartItemDTO {
    private Long id;
    private ProductDTO product;
    private Integer quantity;
    private Double subtotal;

    public CartItemDTO() {}

    public CartItemDTO(Long id, ProductDTO product, Integer quantity, Double subtotal) {
        this.id = id;
        this.product = product;
        this.quantity = quantity;
        this.subtotal = subtotal;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public ProductDTO getProduct() { return product; }
    public void setProduct(ProductDTO product) { this.product = product; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }
}
