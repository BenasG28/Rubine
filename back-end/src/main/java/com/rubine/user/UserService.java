package com.rubine.user;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("User with this email already exists");
        }

        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            String encryptedPassword = bCryptPasswordEncoder.encode(user.getPassword());
            user.setPassword(encryptedPassword);
        } else {
            throw new IllegalArgumentException("Password cannot be empty");
        }

        Set<Role> roles = getValidRoles(user.getRoles());
        user.setRoles(roles);
        return userRepository.save(user);
    }

    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    public User updateUser(User user, User updatedUser) {
        user.setName(updatedUser.getName());
        user.setSurname(updatedUser.getSurname());
        user.setEmail(updatedUser.getEmail());
        user.setPhoneNumber(updatedUser.getPhoneNumber());
        user.setGender(updatedUser.getGender());
        user.setBirthDate(updatedUser.getBirthDate());
        user.setSelectedRegion(updatedUser.getSelectedRegion());
        Set<Role> updatedRoles = getValidRoles(updatedUser.getRoles());
        user.setRoles(updatedRoles);
        return userRepository.save(user);
    }

    public void deleteUser(User user) {
        userRepository.delete(user);
    }

    private Set<Role> getValidRoles(Set<Role> roles) {
        return roles.stream()
                .map(role -> roleRepository.findByName(role.getName())
                        .orElseThrow(() -> new IllegalArgumentException("Role not found: " + role.getName())))
                .collect(Collectors.toSet());
    }

}
