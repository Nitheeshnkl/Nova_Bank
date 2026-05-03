package com.novabank.service;

import com.novabank.models.User;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface AccountService {
    ResponseEntity createAccount(Map<String, String> requestMap, User user);
}