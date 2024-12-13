package com.rubine.order;

import com.rubine.cart.Cart;
import com.rubine.cart.CartItem;
import com.rubine.cart.CartService;
import com.rubine.exception.InsufficientStockException;
import com.rubine.product.ProductStock;
import com.rubine.product.ProductStockRepository;
import com.rubine.user.UserService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import com.rubine.user.User;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class OrderService {

    private final CartService cartService;
    private final ProductStockRepository productStockRepository;
    private final OrderRepository orderRepository;
    private final UserService userService;

    public OrderService(OrderRepository orderRepository, UserService userService, CartService cartService, ProductStockRepository productStockRepository) {
        this.orderRepository = orderRepository;
        this.userService = userService;
        this.cartService = cartService;
        this.productStockRepository = productStockRepository;
    }

    // Get all orders
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Get an order by ID
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    // Create a new order
    public Order createOrder(Order order) {
        User user = getValidUser(order.getUser().getId());
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

    private User getValidUser(Long userId) {
        return userService.getUserById(userId).orElse(null);
    }

    @Transactional
    public Order placeOrder(Long userId, String paymentMethod, String cardNumber) {
        User user = getValidUser(userId);

        Cart cart = cartService.getCartForUser(userId);
        if (cart == null || cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty. Cannot place an order.");
        }

        PaymentMethod paymentMethodEnum = PaymentMethod.fromString(paymentMethod);
        boolean isPaid = processPayment(paymentMethodEnum, cardNumber);

        Order order = new Order();
        double totalPurchaseAmount = 0;
        List<LineItem> lineItems = new ArrayList<>();
        for (CartItem cartItem : cart.getItems()) {
            ProductStock productStock = productStockRepository.findByProductIdAndSize(
                    cartItem.getProduct().getId(),
                    cartItem.getProductSize()
            );

            if (productStock.getQuantity() < cartItem.getQuantity()) {
                throw new InsufficientStockException("Size " + cartItem.getProductSize() + " is out of stock.");
            }

            productStock.setQuantity(productStock.getQuantity() - cartItem.getQuantity());
            productStockRepository.save(productStock);

            // Create LineItem
            LineItem lineItem = new LineItem();
            lineItem.setQuantity(cartItem.getQuantity());
            lineItem.setProductId(cartItem.getProduct().getId());
            lineItem.setProductSize(productStock.getSize());
            lineItem.setProductName(cartItem.getProduct().getDescription());
            lineItem.setOrder(order);

            lineItems.add(lineItem);

            // Accumulate total price
            totalPurchaseAmount += cartItem.getTotalPrice();
        }
        order.setUser(user);
        order.setStatus(isPaid ? OrderStatus.COMPLETED : OrderStatus.PENDING);
        order.setDateCreated(LocalDate.now());
        order.setPaymentMethod(paymentMethodEnum);
        order.setLineItems(lineItems);
        order.setPurchaseAmount(totalPurchaseAmount);

        return orderRepository.saveAndFlush(order);
    }

    private boolean processPayment(PaymentMethod paymentMethod, String cardNumber) {
        if (PaymentMethod.CARD.equals(paymentMethod)) {
            if (cardNumber == null || cardNumber.length() != 16) {
                throw new IllegalArgumentException("Invalid card number");
            }
            return true;
        } else if (PaymentMethod.CASH.equals(paymentMethod)) {
            return false;
        } else {
            throw new IllegalArgumentException("Invalid payment method");
        }
    }
}
