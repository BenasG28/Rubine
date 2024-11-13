package com.rubine.order;

import com.rubine.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

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

    @Column(nullable = true)
    private LocalDate dateCreated;

    @Column(nullable = true)
    private Double purchaseAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private OrderStatus status;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @Override
    public String toString() {
        return "Order{" +
                "id=" + id +
                ", dateCreated=" + dateCreated +
                ", purchaseAmount=" + purchaseAmount +
                ", status=" + status +
                ", user=" + user +
                '}';
    }
}
