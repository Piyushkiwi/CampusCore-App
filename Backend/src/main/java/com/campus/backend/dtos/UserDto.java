package com.campus.backend.dtos;

import com.campus.backend.entity.enums.Role;
import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private Role role;
    private String password;
}
