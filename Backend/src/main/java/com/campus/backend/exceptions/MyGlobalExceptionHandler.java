package com.campus.backend.exceptions;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class MyGlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> myResourceNotFoundException(ResourceNotFoundException e){
        String message=e.getMessage();
        return ResponseEntity.status(404).body(message);
    }
}
