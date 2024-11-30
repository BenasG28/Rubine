package com.rubine.user;

import java.util.List;

public record UserResponse(Long id, String email, List<String> roles) {}
