package com.rubine.product;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductSearchResultDto {
    private Long id;
    private String description;
    private String imageUrl;
    private Double price;
}
