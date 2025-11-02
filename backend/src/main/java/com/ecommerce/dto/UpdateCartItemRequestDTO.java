package com.ecommerce.dto;

public class UpdateCartItemRequestDTO {
    private Integer quantity;

    public UpdateCartItemRequestDTO() {}

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
