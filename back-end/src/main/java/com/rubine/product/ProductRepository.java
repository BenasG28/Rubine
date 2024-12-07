package com.rubine.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.productStocks WHERE p.id = :id")
    Optional<Product> findByIdWithStocks(@Param("id") Long id);

    @Query("""
           select p
           from Product p
           where lower(p.description) like lower(concat('%', :query, '%'))
           or lower(p.brand) like lower(concat('%', :query, '%'))
           or lower(p.color) like lower(concat('%', :query, '%'))
           """)
    List<Product> findBySearchQuery(String query);} // Prideti pagination jei reikes.
