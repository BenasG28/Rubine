package com.rubine.cart;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CartDto {
    private Long id;
    private List<CartItemDto> items;
}
