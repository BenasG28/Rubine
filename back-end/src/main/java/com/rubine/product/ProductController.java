package com.rubine.product;

import com.rubine.user.UserController;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/products")
public class ProductController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final ProductService productService;  // Inject the ProductService
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public ProductController(ProductService productService, ProductRepository productRepository, ProductMapper productMapper) {
        this.productService = productService;
        this.productRepository = productRepository;
        this.productMapper = productMapper;
    }

    // Get all products
    @GetMapping("/all")
    public ResponseEntity<List<ProductSearchResultDto>> getAllProducts() {
        try {
            List<Product> products = productService.getAllProducts();  // Use service to get all products
            if (products.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);  // 204 No Content if no products
            }
            return new ResponseEntity<>(productMapper.toProductSearchResultDtoList(products), HttpStatus.OK);  // 200 OK with list of products
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
            // Convert size to uppercase before parsing
            ProductStock productStock = productService.updateProductStock(
                    productId,
                    ProductSize.valueOf(request.getSize().toUpperCase()),
                    request.getQuantity()
            );
            return ResponseEntity.ok(productStock);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // Return 400 Bad Request with no body
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Return 404 Not Found with no body
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductSearchResultDto>> searchProducts(@RequestParam String query) {
        List<Product> products = productService.searchProducts(query);
        if (products.isEmpty()) {
            products = Collections.emptyList();
        }
        return new ResponseEntity<>(productMapper.toProductSearchResultDtoList(products), HttpStatus.OK);
    }

}