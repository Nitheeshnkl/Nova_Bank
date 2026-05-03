package com.novabank.controllers;

import com.novabank.models.User;
import com.novabank.repository.UserRepository;
import com.novabank.service.RegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.*;

@RestController
public class RegisterController {

    @Autowired
    private RegisterService registerService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user, BindingResult bindingResult, @RequestParam("confirm_password") String confirmPassword) {
        normalizeNames(user);

        if (bindingResult.hasErrors() || confirmPassword == null || confirmPassword.isEmpty() || !isValidName(user.getFirst_name()) || !isValidName(user.getLast_name())) {
            List<String> errorMessages = new ArrayList<>();
            for(FieldError error : bindingResult.getFieldErrors()){
                errorMessages.add(error.getDefaultMessage());
            }
            if (!bindingResult.hasFieldErrors("first_name") && !isValidName(user.getFirst_name())) {
                errorMessages.add("First name must contain at least 3 alphabetic characters and cannot be numeric.");
            }
            if (!bindingResult.hasFieldErrors("last_name") && !isValidName(user.getLast_name())) {
                errorMessages.add("Last name must contain at least 3 alphabetic characters and cannot be numeric.");
            }
            if (confirmPassword == null || confirmPassword.isEmpty()) {
                errorMessages.add("Confirm password cannot be empty.");
            }

            return ResponseEntity.badRequest().body(errorMessages);
        }

        return registerService.registerUser(user, confirmPassword);

    }

    private void normalizeNames(User user) {
        if (user.getFirst_name() != null) {
            user.setFirst_name(user.getFirst_name().trim().replaceAll("\\s+", " "));
        }
        if (user.getLast_name() != null) {
            user.setLast_name(user.getLast_name().trim().replaceAll("\\s+", " "));
        }
    }

    private boolean isValidName(String name) {
        if (name == null) {
            return false;
        }
        String trimmedName = name.trim();
        return trimmedName.length() >= 3
                && trimmedName.matches(".*[A-Za-z].*")
                && trimmedName.matches("[A-Za-z][A-Za-z '\\-]*");
    }
}
