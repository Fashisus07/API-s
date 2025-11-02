package com.ecommerce.dto;

public class AddToCartRequestDTO {
    private Long productId;
    private Integer quantity;

    public AddToCartRequestDTO() {}

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
