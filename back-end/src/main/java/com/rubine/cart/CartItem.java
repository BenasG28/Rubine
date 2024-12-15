package com.rubine.cart;

import com.rubine.product.Product;
import com.rubine.product.ProductSize;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    ProductSize productSize;
    private int quantity;
    private double price;

    public double getTotalPrice() {
        return price * quantity;
    }
}
