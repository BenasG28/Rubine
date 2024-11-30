package com.rubine.order;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;

    public OrderController(OrderService orderService, OrderRepository orderRepository, OrderMapper orderMapper) {
        this.orderService = orderService;
        this.orderRepository = orderRepository;
        this.orderMapper = orderMapper;
    }

    // Get all orders
    @GetMapping("/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        try {
            List<Order> orders = orderService.getAllOrders();  // Use service to get all orders
            if (orders.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);  // 204 No Content if no orders
            }
            return new ResponseEntity<>(orders, HttpStatus.OK);  // 200 OK with list of orders
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();  // 500 Internal Server Error
        }
    }

    // Get order by ID
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Order order = orderService.getOrderById(id).orElseThrow();  // Call service to get order by ID
        if (order != null) {
            return new ResponseEntity<>(order, HttpStatus.OK); // 200 OK with the order
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found if order does not exist
        }
    }

    // Update order by ID
    @PutMapping("/update/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order updatedOrder) {
        Order updated = orderService.updateOrder(id, updatedOrder);  // Call service to update order
        if (updated != null) {
            return new ResponseEntity<>(updated, HttpStatus.OK); // 200 OK with updated order
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found if order does not exist
        }
    }

    // Create a new order
    @PostMapping("/create")
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        System.out.println("order" + order.toString());
        Order createdOrder = orderService.createOrder(order);  // Use service to save the order
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);  // 201 Created with the order
    }

    // Delete order by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        if (orderRepository.existsById(id)) {
            orderRepository.deleteById(id);  // Delete the order
            return ResponseEntity.noContent().build();  // 204 No Content on successful deletion
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();  // 404 Not Found if order doesn't exist
    }

    @PostMapping("/{userId}/place")
    public OrderDto placeOrder(@PathVariable Long userId, @RequestBody PaymentRequest paymentRequest) {
        Order order = orderService.placeOrder(userId, paymentRequest.getPaymentMethod(), paymentRequest.getCardNumber());
        return orderMapper.toOrderDto(order);
    }
}
