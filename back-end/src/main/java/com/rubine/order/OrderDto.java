package com.rubine.order;

import com.rubine.user.UserDto;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class OrderDto {
    private Long id;
    private OrderStatus status;
    private PaymentMethod paymentMethod;
    private List<LineItemDto> lineItems;
    private LocalDate dateCreated;
    private Double purchaseAmount;
    private UserDto user;
}
