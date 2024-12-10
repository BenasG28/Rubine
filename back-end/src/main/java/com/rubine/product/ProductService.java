package com.rubine.product;

import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public ProductService(ProductRepository productRepository, ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;
    }
    // CRUD metodai
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        return productRepository.findById(id)
                .map(existingProduct -> {
                    productMapper.updateProduct(updatedProduct, existingProduct);
                    return productRepository.save(existingProduct);
                })
                .orElse(null);
    }

    public List<Product> searchProducts(String query) {
        if (query == null || query.isEmpty()) {
            return Collections.emptyList();
        }

        return productRepository.findBySearchQuery(query);
    }
}