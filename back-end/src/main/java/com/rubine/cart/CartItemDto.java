package com.rubine.cart;

import com.rubine.product.Product;
import com.rubine.product.ProductSize;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartItemDto {
    private Long id;
    private double price;
    private int quantity;
    private ProductSize productSize;
    private Product product;
}
