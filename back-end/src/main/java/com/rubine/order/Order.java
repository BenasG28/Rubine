package com.rubine.order;

import com.rubine.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "orders") //"order" is a reserved name in SQL or MySQL lol fml
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column
    private LocalDate dateCreated;

    @Column
    private Double purchaseAmount;

    @Enumerated(EnumType.STRING)
    @Column
    private OrderStatus status;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<LineItem> lineItems;

    private PaymentMethod paymentMethod;

    private boolean isPaid;

}
