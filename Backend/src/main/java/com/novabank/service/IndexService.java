package com.novabank.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


public interface IndexService {
    ResponseEntity<?> getVerify(String token, String code);
}
