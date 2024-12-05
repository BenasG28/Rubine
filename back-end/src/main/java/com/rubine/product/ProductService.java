package com.rubine.product;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    private final ProductStockRepository productStockRepository;

    public ProductService(ProductRepository productRepository, ProductStockRepository productStockRepository) {
        this.productRepository = productRepository;
        this.productStockRepository = productStockRepository;
    }

    // Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Delete a product by ID
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    // Save a new product (create)
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }
    public Optional<Product> getProductById(Long id) {return productRepository.findById(id);}

    //----------------------------------------------------------------------------------------------------
    public Product getProductWithStocks(Long productId) {
        return productRepository.findByIdWithStocks(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
    }
    //----------------------------------------------------------------------------------------------------
    // Update an existing product (PUT /products/update/{id})
    public Product updateProduct(Long id, Product updatedProduct) {
        Optional<Product> existingProductOptional = productRepository.findById(id);
        if (existingProductOptional.isPresent()) {
            Product existingProduct = existingProductOptional.get();
            // Update fields if they are not null
            if (updatedProduct.getBrand() != null) existingProduct.setBrand(updatedProduct.getBrand());
            if (updatedProduct.getColor() != null) existingProduct.setColor(updatedProduct.getColor());
            if (updatedProduct.getDescription() != null) existingProduct.setDescription(updatedProduct.getDescription());
            if (updatedProduct.getImageUrl() != null) existingProduct.setImageUrl(updatedProduct.getImageUrl());
            if (updatedProduct.getPrice() != null) existingProduct.setPrice(updatedProduct.getPrice());
            if (updatedProduct.getProductType() != null) existingProduct.setProductType(updatedProduct.getProductType());

            return productRepository.save(existingProduct); // Save the updated product
        } else {
            return null; // Return null or throw an exception if the product doesn't exist
        }
    }
    // Add or update stock for a product and its size
    public ProductStock updateProductStock(Long productId, ProductSize size, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        // Check if stock already exists for this size
        ProductStock existingStock = product.getProductStocks().stream()
                .filter(stock -> stock.getSize() == size)
                .findFirst()
                .orElse(null);

        if (existingStock != null) {
            // Update stock quantity
            existingStock.setQuantity(quantity);
            return productStockRepository.save(existingStock);
        } else {
            // Create a new stock entry if not found
            ProductStock newStock = new ProductStock();
            newStock.setProduct(product);
            newStock.setSize(size);
            newStock.setQuantity(quantity);
            return productStockRepository.save(newStock);
        }
    }

    public List<Product> searchProducts(String query) {
        if (query == null || query.isEmpty()) {
            return Collections.emptyList();
        }

        return productRepository.findBySearchQuery(query);
    }
}