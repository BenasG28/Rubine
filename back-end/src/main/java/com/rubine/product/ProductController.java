package com.rubine.product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;  // Inject the ProductService

    @Autowired
    private ProductRepository productRepository;

    // Get all products
    @GetMapping("/all")
    public ResponseEntity<List<Product>> getAllProducts() {
        try {
            List<Product> products = productService.getAllProducts();  // Use service to get all products
            if (products.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);  // 204 No Content if no products
            }
            return new ResponseEntity<>(products, HttpStatus.OK);  // 200 OK with list of products
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();  // 500 Internal Server Error
        }
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

    // Delete product by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);  // Delete the product
            return ResponseEntity.noContent().build();  // 204 No Content on successful deletion
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();  // 404 Not Found if product doesn't exist
    }
}