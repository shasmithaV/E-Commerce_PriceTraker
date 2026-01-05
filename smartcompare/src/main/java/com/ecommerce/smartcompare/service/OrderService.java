package com.ecommerce.smartcompare.service;

import com.ecommerce.smartcompare.model.*;
import com.ecommerce.smartcompare.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;


    public OrderService(
        OrderRepository orderRepository,
        OrderItemRepository orderItemRepository,
        CartRepository cartRepository,
        ProductRepository productRepository,
        UserRepository userRepository
    ) {
    this.orderRepository = orderRepository;
    this.orderItemRepository = orderItemRepository;
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
    this.userRepository = userRepository;
    }


    @Transactional
public Order placeOrder(String email) {

    // 🔥 1️⃣ Load REAL User entity from DB
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // 🔥 2️⃣ Now cart lookup will WORK
    Cart cart = cartRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("Cart not found"));

    if (cart.getItems().isEmpty()) {
        throw new RuntimeException("Cart is empty");
    }

    Order order = new Order();
    order.setUser(user);

    BigDecimal totalAmount = BigDecimal.ZERO;
    List<OrderItem> orderItems = new ArrayList<>();

    for (CartItem cartItem : cart.getItems()) {

        Product product = cartItem.getProduct();

        if (product.getStock() < cartItem.getQuantity()) {
            throw new RuntimeException("Insufficient stock for " + product.getName());
        }

        product.setStock(product.getStock() - cartItem.getQuantity());
        productRepository.save(product);

        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setProduct(product);
        orderItem.setQuantity(cartItem.getQuantity());
        orderItem.setPriceAtPurchase(product.getPrice());

        orderItems.add(orderItem);

        totalAmount = totalAmount.add(
                product.getPrice().multiply(
                        BigDecimal.valueOf(cartItem.getQuantity())
                )
        );
    }

    order.setTotalAmount(totalAmount.doubleValue());
    order.setItems(orderItems);

    Order savedOrder = orderRepository.save(order);

    cart.getItems().clear();
    cartRepository.save(cart);

    return savedOrder;
    }

    public List<Order> getMyOrders(String email) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    return orderRepository.findByUserOrderByCreatedAtDesc(user);
}

    public List<Order> getAllOrders() {
    return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus newStatus) {

    Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));

    OrderStatus current = order.getStatus();

    // ❌ Terminal states
    if (current == OrderStatus.DELIVERED || current == OrderStatus.CANCELLED) {
        throw new RuntimeException("Order is already finalized");
    }

    // ❌ Invalid transitions
    if (current == OrderStatus.PLACED && newStatus == OrderStatus.DELIVERED) {
        throw new RuntimeException("Must ship before delivery");
    }

    if (current == OrderStatus.SHIPPED &&
        (newStatus == OrderStatus.PLACED || newStatus == OrderStatus.CANCELLED)) {
        throw new RuntimeException("Invalid status change");
    }

    order.setStatus(newStatus);
    return orderRepository.save(order);
    }

    public Map<String, Object> getAdminAnalytics() {

    Long totalOrders = orderRepository.countTotalOrders();
    Double totalRevenue = orderRepository.calculateTotalRevenue();

    List<Object[]> statusCounts = orderRepository.countOrdersByStatus();
    Map<String, Long> ordersByStatus = new HashMap<>();

    for (Object[] row : statusCounts) {
        ordersByStatus.put(
                row[0].toString(),
                (Long) row[1]
        );
    }

    return Map.of(
            "totalOrders", totalOrders,
            "totalRevenue", totalRevenue,
            "ordersByStatus", ordersByStatus
    );
    }


}
