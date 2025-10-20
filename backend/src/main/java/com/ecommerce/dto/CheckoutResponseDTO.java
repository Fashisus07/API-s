package com.ecommerce.dto;

public class CheckoutResponseDTO {
    private String message;
    private Double total;
    private Integer itemsCount;

    public CheckoutResponseDTO() {}

    public CheckoutResponseDTO(String message, Double total, Integer itemsCount) {
        this.message = message;
        this.total = total;
        this.itemsCount = itemsCount;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
    
    public Integer getItemsCount() { return itemsCount; }
    public void setItemsCount(Integer itemsCount) { this.itemsCount = itemsCount; }
}
