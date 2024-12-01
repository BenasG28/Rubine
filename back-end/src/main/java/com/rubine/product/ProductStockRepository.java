package com.rubine.product;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductStockRepository extends JpaRepository<ProductStock, Long> {
    // Optional: You can add custom queries here if needed
}
