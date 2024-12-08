package com.rubine.product;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class InventoryItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String size;
    private int quantity;
    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonBackReference  // Prevents circular reference and avoids serialization of the back reference
    private Product product;
    public InventoryItem(String size, int quantity) {
        this.size = size;
        this.quantity = quantity;
    }
}
