package com.rubine.cart;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
public class CartController {
    private final CartService cartService;
    private final CartMapper cartMapper;

    public CartController(CartService cartService, CartMapper cartMapper) {
        this.cartService = cartService;
        this.cartMapper = cartMapper;
    }

    @GetMapping("/{userId}")
    public CartDto getCart(@PathVariable Long userId) {
        Cart cart = cartService.getCartForUser(userId);
        return cartMapper.toCartDto(cart);
    }

    @PostMapping("/{userId}/add")
    public CartDto addToCart(@PathVariable Long userId, @RequestParam Long productId, @RequestParam int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }
        Cart cart = cartService.addItemToCart(userId, productId, quantity);
        return cartMapper.toCartDto(cart);
    }

    @DeleteMapping("/{userId}/remove")
    public CartDto removeItemFromCart(@PathVariable Long userId, @RequestParam Long productId) {
        Cart cart = cartService.removeItemFromCart(userId, productId);
        return cartMapper.toCartDto(cart);
    }

    @DeleteMapping("/{userId}/clear")
    public CartDto clearCart(@PathVariable Long userId) {
        Cart cart = cartService.clearCart(userId);
        return cartMapper.toCartDto(cart);
    }
}
