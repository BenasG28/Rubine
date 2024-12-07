package com.rubine.product;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductMapper INSTANCE = Mappers.getMapper(ProductMapper.class);

    ProductSearchResultDto toProductSearchResultDto(Product product);

    List<ProductSearchResultDto> toProductSearchResultDtoList(List<Product> products);

    Product toProduct(ProductSearchResultDto productSearchResultDto);
}
