package com.rubine.user;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;
    private final UserMapper userMapper;

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    public UserController(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    //TODO Implement difference in data retrieval for SYS_ADMIN and ADMIN (password, other sensitive info).

    @GetMapping("/all")
    private ResponseEntity<List<UserDto>> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            if (users.isEmpty()) {
                logger.warn("No users found");
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(userMapper.toUserDtoList(users));
            }
            return ResponseEntity.ok(userMapper.toUserDtoList(users));
        } catch (Exception e) {
            logger.error("Error getting all users", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long userId) {
         User user = userService.getUserById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return ResponseEntity.ok(userMapper.toUserDto(user));
    }

    @PostMapping("/create")
    public ResponseEntity<UserDto> createUser(@RequestBody User user) {
        try {
            User savedUser = userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(userMapper.toUserDto(user));
        } catch (Exception e) {
            logger.error("Error creating user", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        try {
            Optional<User> user = userService.getUserById(userId);
            if (user.isPresent()) {
                userService.deleteUser(user.get());
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            } else {
                logger.warn("User with ID {} not found for deletion", userId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            logger.error("Error deleting user", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long userId, @RequestBody User updatedUser) {
        return userService.getUserById(userId)
                .map(existingUser -> {
                    User savedUser = userService.updateUser(existingUser, updatedUser);
                    return ResponseEntity.ok(userMapper.toUserDto(savedUser));
                })
                .orElseGet(() -> {
                    logger.warn("User with ID {} not found for updating", userId);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
                });
    }

}
