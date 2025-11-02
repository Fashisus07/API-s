package com.ecommerce.dto;

public class CheckoutResponseDTO {
    private String message;
    private Double total;
    private Integer items;

    public CheckoutResponseDTO() {}

    public CheckoutResponseDTO(String message, Double total, Integer items) {
        this.message = message;
        this.total = total;
        this.items = items;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
    public Integer getItems() { return items; }
    public void setItems(Integer items) { this.items = items; }
}
