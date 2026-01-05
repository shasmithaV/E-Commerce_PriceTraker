package com.ecommerce.smartcompare.controller;

import com.ecommerce.smartcompare.model.Order;
import com.ecommerce.smartcompare.model.User;
import com.ecommerce.smartcompare.service.OrderService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public Order placeOrder(@AuthenticationPrincipal String email) {
        return orderService.placeOrder(email);
    }

    @GetMapping("/my")
    public List<Order> getMyOrders(@AuthenticationPrincipal String email) {
        return orderService.getMyOrders(email);
}


}
