package com.rubine.product;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductStockService {
    private final ProductStockRepository productStockRepository;
    private final ProductRepository productRepository;

    @Autowired
    public ProductStockService(ProductStockRepository productStockRepository, ProductRepository productRepository) {
        this.productStockRepository = productStockRepository;
        this.productRepository = productRepository;
    }

    public Product getProductWithStocks(Long productId) {
        return productRepository.findByIdWithStocks(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
    }

    public ProductStock updateProductStock(Product product, ProductSize size, int quantity) {
        if (product == null) {
            throw new EntityNotFoundException("Product not found");
        }
        ProductStock existingStock = product.getProductStocks().stream()
                .filter(stock -> stock.getSize() == size)
                .findFirst()
                .orElse(null);

        if (existingStock != null) {
            existingStock.setQuantity(quantity);
            return productStockRepository.save(existingStock);
        } else {
            ProductStock newStock = new ProductStock();
            newStock.setProduct(product);
            newStock.setSize(size);
            newStock.setQuantity(quantity);
            return productStockRepository.save(newStock);
        }
    }
}