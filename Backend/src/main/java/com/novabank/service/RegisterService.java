package com.novabank.service;

import com.novabank.models.User;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
public interface RegisterService {
    ResponseEntity<?> registerUser(User user, String confirmPassword);
}
