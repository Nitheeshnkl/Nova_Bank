package com.novabank.service;

import com.novabank.models.PaymentRequest;
import com.novabank.models.TransferRequest;
import com.novabank.models.User;
import org.springframework.http.ResponseEntity;

import java.util.Map;


public interface TransactService {
    public ResponseEntity deposit(Map<String, String> requestMap, User user);

    public ResponseEntity payment(PaymentRequest request, User user);

    public ResponseEntity withdraw(Map<String, String> requestMap, User user);

    public ResponseEntity transfer(TransferRequest request, User user);
}
