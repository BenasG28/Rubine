package com.rubine.order;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.rubine.user.User;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    // Get all orders
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Get an order by ID
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    // Create a new order
    public Order createOrder(Order order) {
        User user = getValidUser(order.getUser());
        return orderRepository.save(order);
    }

    // Update an existing order
    public Order updateOrder(Long id, Order updatedOrder) {
        Optional<Order> existingOrderOptional = orderRepository.findById(id);
        if (existingOrderOptional.isPresent()) {
            Order existingOrder = existingOrderOptional.get();
            // Update fields if they are not null
            if (updatedOrder.getDateCreated() != null) existingOrder.setDateCreated(updatedOrder.getDateCreated());
            if (updatedOrder.getPurchaseAmount() != null) existingOrder.setPurchaseAmount(updatedOrder.getPurchaseAmount());
            if (updatedOrder.getStatus() != null) existingOrder.setStatus(updatedOrder.getStatus());
            if (updatedOrder.getUser() != null) existingOrder.setUser(updatedOrder.getUser());

            return orderRepository.save(existingOrder); // Save the updated order
        } else {
            return null; // Return null or throw an exception if the order doesn't exist
        }
    }

    // Delete an order by ID
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    private User getValidUser(User user) {
        return null;
    }
}
