package com.rubine.order;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrderDto {
    private Long id;
    private OrderStatus status;
    private PaymentMethod paymentMethod;
    private List<LineItemDto> lineItems;
    private Double purchaseAmount;
}
