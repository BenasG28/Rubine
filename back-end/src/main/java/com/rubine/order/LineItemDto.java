package com.rubine.order;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LineItemDto {
    private Long id;
    private Long productId;
    private int quantity;

}
