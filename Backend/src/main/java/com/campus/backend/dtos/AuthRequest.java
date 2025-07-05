package com.campus.backend.dtos;

import lombok.Data;

@Data
public class AuthRequest {
    private String username;
    private String password;
}