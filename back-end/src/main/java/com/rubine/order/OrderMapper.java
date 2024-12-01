package com.rubine.order;

import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    OrderDto toOrderDto(Order order);

    List<LineItemDto> toLineItemDtoList(List<LineItem> lineItemList);

    Order toOrder(OrderDto orderDto);

    LineItemDto toLineItemDto(LineItem lineItem);

    LineItem toLineItem(LineItemDto lineItemDto);
}
