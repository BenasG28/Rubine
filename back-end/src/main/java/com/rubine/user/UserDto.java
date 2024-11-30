package com.rubine.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
public class UserDto {
    private Long id;
    private String name;
    @JsonIgnore
    private String password;
    private String surname;
    private String email;
    private String phoneNumber;
    private Gender gender;
    private LocalDate birthDate;
    private Region selectedRegion;
    private Set<Role> roles;


}
