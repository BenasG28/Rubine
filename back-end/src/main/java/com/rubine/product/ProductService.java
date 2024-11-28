package com.rubine.product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

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
}