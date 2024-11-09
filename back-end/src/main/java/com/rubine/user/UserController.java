package com.rubine.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/all")
    private ResponseEntity<List<User>> getAllUsers() {
        System.out.println("invoked");
        List<User> users = userRepository.findAll();
        if (users.isEmpty()) {
            System.out.println("bad");
        }
        return ResponseEntity.ok(users);
    }
}
