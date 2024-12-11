package com.rubine.product;

import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;
import org.mapstruct.MappingTarget;
import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ProductMapper {
    ProductMapper INSTANCE = Mappers.getMapper(ProductMapper.class);

    ProductSearchResultDto toProductSearchResultDto(Product product);

    List<ProductSearchResultDto> toProductSearchResultDtoList(List<Product> products);

    Product toProduct(ProductSearchResultDto productSearchResultDto);
    void updateProduct(Product updatedProduct, @MappingTarget Product existingProduct);
}

