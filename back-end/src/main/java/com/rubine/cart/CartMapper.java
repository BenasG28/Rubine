package com.rubine.cart;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CartMapper {

    CartItemDto toCartItemDto(CartItem cartItem);

    CartItem toCartItem(CartItemDto cartItemDto);

    CartDto toCartDto(Cart cart);

    Cart toCart(CartDto cartDto);
}
