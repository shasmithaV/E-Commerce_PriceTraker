package com.ecommerce.smartcompare.controller;

import com.ecommerce.smartcompare.model.Order;
import com.ecommerce.smartcompare.model.OrderStatus;
import com.ecommerce.smartcompare.service.OrderService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/orders")
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // ✅ View all orders
    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    // ✅ Update order status
    @PutMapping("/{orderId}/status")
    public Order updateStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {
        return orderService.updateOrderStatus(orderId, status);
    }

    @GetMapping("/analytics")
    public Map<String, Object> getAnalytics() {
        return orderService.getAdminAnalytics();
    }

}
