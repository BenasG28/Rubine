package com.rubine.order;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequest {
    private String paymentMethod;
    private String cardNumber;
}
