package com.rubine.order;

public enum PaymentMethod {
    CARD, CASH;

    public static PaymentMethod fromString(String method) {
        try {
            return PaymentMethod.valueOf(method.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid payment method. Use 'CARD' or 'CASH'.");
        }
    }
}
