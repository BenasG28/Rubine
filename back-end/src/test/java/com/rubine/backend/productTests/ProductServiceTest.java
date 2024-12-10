package com.rubine.backend.productTests;

import com.rubine.product.*;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


@SpringBootTest
public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductStockRepository productStockRepository;

    @Autowired
    private ProductMapper productMapper;

    private ProductService productService;
    private ProductStockService productStockService;

    private Product product;
    private Product updatedProduct;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        productService = new ProductService(productRepository, productMapper);
        productStockService = new ProductStockService(productStockRepository, productRepository);

        product = new Product();
        product.setId(1L);
        product.setBrand("Brand A");

        updatedProduct = new Product();
        updatedProduct.setBrand("Updated Brand");
    }
    @Test
    void testGetAllProducts() {
        when(productRepository.findAll()).thenReturn(List.of(product));

        var result = productService.getAllProducts();

        assertNotNull(result);
        assertFalse(result.isEmpty());
        verify(productRepository, times(1)).findAll();
    }

    @Test
    void testDeleteProduct() {
        doNothing().when(productRepository).deleteById(anyLong());

        productService.deleteProduct(1L);

        verify(productRepository, times(1)).deleteById(1L);
    }

    @Test
    void testSaveProduct() {
        when(productRepository.save(any(Product.class))).thenReturn(product);

        var savedProduct = productService.saveProduct(product);

        assertNotNull(savedProduct);
        assertEquals(product, savedProduct);
        verify(productRepository, times(1)).save(product);
    }

    @Test
    void testGetProductById() {
        when(productRepository.findById(anyLong())).thenReturn(Optional.of(product));

        var result = productService.getProductById(1L);

        assertTrue(result.isPresent());
        assertEquals(product, result.get());
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    void testGetProductWithStocks() {
        when(productRepository.findByIdWithStocks(anyLong())).thenReturn(Optional.of(product));

        var result = productStockService.getProductWithStocks(1L);

        assertNotNull(result);
        verify(productRepository, times(1)).findByIdWithStocks(1L);
    }

    @Test
    void testGetProductWithStocks_ProductNotFound() {
        when(productRepository.findByIdWithStocks(anyLong())).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> productStockService.getProductWithStocks(1L));
    }

    @Test
    public void testUpdateProduct() {
        // Given
        Long productId = 1L;
        Product existingProduct = new Product();
        existingProduct.setId(productId);
        existingProduct.setDescription("Senas aprasymas");

        Product updatedProduct = new Product();
        updatedProduct.setDescription("Naujas aprasymas");

        when(productRepository.findById(productId)).thenReturn(Optional.of(existingProduct));
        when(productRepository.save(existingProduct)).thenReturn(existingProduct);

        // When
        Product result = productService.updateProduct(productId, updatedProduct);

        System.out.println("After Update: " + existingProduct.getDescription());

        // Then
        assertNotNull(result);
        assertEquals("Naujas aprasymas", result.getDescription());  // Now asserting the updated value
        verify(productRepository).save(existingProduct);
    }
    @Test
    void testUpdateProduct_ProductNotFound() {
        when(productRepository.findById(anyLong())).thenReturn(Optional.empty());

        var result = productService.updateProduct(1L, updatedProduct);

        assertNull(result);
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    void testUpdateProductStock_ExistingStock() {
        // Given
        ProductStock existingStock = new ProductStock();
        existingStock.setProduct(product);
        existingStock.setSize(ProductSize.M);
        existingStock.setQuantity(10);  // Initial quantity of 10

        ProductStock updatedStockTo20 = new ProductStock();
        updatedStockTo20.setProduct(product);
        updatedStockTo20.setSize(ProductSize.M);
        updatedStockTo20.setQuantity(20);  // The first update to 20

        ProductStock updatedStockTo30 = new ProductStock();
        updatedStockTo30.setProduct(product);
        updatedStockTo30.setSize(ProductSize.M);
        updatedStockTo30.setQuantity(30);  // The second update to 30

        // Mocking behavior
        when(productRepository.findById(anyLong())).thenReturn(Optional.of(product));  // Mock product repository
        when(productStockRepository.save(any(ProductStock.class)))
                .thenReturn(updatedStockTo20)  // First call returns updated stock to 20
                .thenReturn(updatedStockTo30);  // Second call returns updated stock to 30

        // When
        ProductStock firstUpdatedStock = productStockService.updateProductStock(product, ProductSize.M, 20);  // First update to 20
        ProductStock secondUpdatedStock = productStockService.updateProductStock(product, ProductSize.M, 30);  // Second update to 30

        // Then
        assertNotNull(firstUpdatedStock);  // Ensure the first update is not null
        assertEquals(20, firstUpdatedStock.getQuantity());  // Assert that the first update quantity is 20
        assertNotNull(secondUpdatedStock);  // Ensure the second update is not null
        assertEquals(30, secondUpdatedStock.getQuantity());  // Assert that the second update quantity is 30

        // Capture the argument passed to save
        ArgumentCaptor<ProductStock> argumentCaptor = ArgumentCaptor.forClass(ProductStock.class);
        verify(productStockRepository, times(2)).save(argumentCaptor.capture());  // Verify save method was called twice

        // Capture and verify the captured ProductStock
        List<ProductStock> capturedStocks = argumentCaptor.getAllValues();
        assertEquals(ProductSize.M, capturedStocks.get(0).getSize());  // Verify the size is the same for both updates
        assertEquals(20, capturedStocks.get(0).getQuantity());  // Verify the quantity for the first update
        assertEquals(ProductSize.M, capturedStocks.get(1).getSize());  // Verify the size for the second update
        assertEquals(30, capturedStocks.get(1).getQuantity());  // Verify the quantity for the second update
    }

    @Test
    void testUpdateProductStock_NewStock() {
        Long productId = 1L;
        ProductSize size = ProductSize.L;
        int quantity = 100;

        // Sukuriame produktą su id
        Product product = new Product();
        product.setId(productId);

        // Mokuokime, kad `productStockRepository.save` grąžins naują sandėlio įrašą
        ProductStock productStock = new ProductStock();
        productStock.setSize(size);
        productStock.setQuantity(quantity);
        when(productStockRepository.save(any(ProductStock.class))).thenReturn(productStock);

        // Kviečiame metodą, kad atnaujintume arba sukurtume naują sandėlio įrašą
        ProductStock savedStock = productStockService.updateProductStock(product, size, quantity);

        // Patikriname, kad sandėlio įrašas ne null ir jo kiekis atitinka
        assertNotNull(savedStock);
        assertEquals(quantity, savedStock.getQuantity());

        // Patikriname, kad buvo iškviestas tik `productStockRepository.save`
        verify(productStockRepository).save(any(ProductStock.class));  // Tikriname, kad `save` metodas buvo iškviestas
    }
    @Test
    void testUpdateProductStock_ProductNotFound() {
        // Pateikiame null produktą, kuris sukelia klaidą
        assertThrows(EntityNotFoundException.class, () -> productStockService.updateProductStock(null, ProductSize.M, 20));
    }
}