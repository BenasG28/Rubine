package com.rubine.product;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/products")
public class ProductController {
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    private final ProductService productService;
    private final ProductStockService productStockService;
    private final ProductRepository productRepository;

    public ProductController(ProductService productService, ProductStockService productStockService, ProductRepository productRepository) {
        this.productService = productService;
        this.productStockService = productStockService;
        this.productRepository = productRepository;
    }

    @GetMapping("/all")
public ResponseEntity<List<Product>> getAllProducts() {
    List<Product> products = productService.getAllProducts();
    if (products.isEmpty()) {
        return handleNoContent();  // Išorinė metodų apdorojimo logika
    }
    return handleSuccessfulResponse(products);  // Išorinė metodų apdorojimo logika
}

    private ResponseEntity<List<Product>> handleNoContent() {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    private ResponseEntity<List<Product>> handleSuccessfulResponse(List<Product> products) {
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // Update product by ID
    @PutMapping("/update/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        Product updated = productService.updateProduct(id, updatedProduct);  // Call service to update product
        if (updated != null) {
            return new ResponseEntity<>(updated, HttpStatus.OK); // 200 OK with updated product
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found if product does not exist
        }
    }

    // Create a new product
    @PostMapping("/create")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product createdProduct = productService.saveProduct(product);  // Use service to save the product
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);  // 201 Created with the product
    }
    @GetMapping("/{productId}")
    public ResponseEntity<Product> getProductById(@PathVariable Long productId) {
        return productService.getProductById(productId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    logger.warn("Product with ID {} not found", productId);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
                });
    }


    // Delete product by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);  // Delete the product
            return ResponseEntity.noContent().build();  // 204 No Content on successful deletion
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();  // 404 Not Found if product doesn't exist
    }

    @PutMapping("/updateStock/{productId}")
    public ResponseEntity<ProductStock> updateStock(
            @PathVariable Long productId,
            @RequestBody ProductStockRequest request) {
        try {
            Product product = productService.getProductById(productId)
                    .orElseThrow(() -> new EntityNotFoundException("Product not found"));
            ProductStock productStock = productStockService.updateProductStock(
                    product,
                    ProductSize.valueOf(request.getSize().toUpperCase()),
                    request.getQuantity()
            );
            return ResponseEntity.ok(productStock);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // Grąžina 400 Bad Request
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Grąžina 404 Not Found
        }
    }
}