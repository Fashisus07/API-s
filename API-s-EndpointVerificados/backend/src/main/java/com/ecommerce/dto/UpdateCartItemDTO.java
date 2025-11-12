package com.ecommerce.dto;

import jakarta.validation.constraints.*;

public class UpdateCartItemDTO {
    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser mayor a 0")
    private Integer quantity;

    public UpdateCartItemDTO() {}

    public UpdateCartItemDTO(Integer quantity) {
        this.quantity = quantity;
    }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
