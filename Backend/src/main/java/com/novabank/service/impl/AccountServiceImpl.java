package com.novabank.service.impl;

import com.novabank.helpers.GenAccountNumber;
import com.novabank.models.User;
import com.novabank.repository.AccountRepository;
import com.novabank.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;

    @Autowired
    public AccountServiceImpl(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public ResponseEntity createAccount(Map<String, String> requestMap, User user) {
        try {
            validateInputFields(requestMap);

            String accountName = requestMap.get("account_name");
            String accountType = requestMap.get("account_type");

            int generatedAccountNumber = GenAccountNumber.generateAccountNumber();
            String bankAccountNumber = String.valueOf(generatedAccountNumber);

            int userId = Integer.parseInt(user.getUser_id());

            accountRepository.createBankAccount(userId, bankAccountNumber, accountName, accountType);

            return ResponseEntity.ok(accountRepository.getUserAccountsById(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating account: " + e.getMessage());
        }
    }

    private void validateInputFields(Map<String, String> requestMap) {
        String accountName = requestMap.get("account_name");
        String accountType = requestMap.get("account_type");

        if (accountName == null || accountName.isEmpty() || accountType == null || accountType.isEmpty()) {
            throw new IllegalArgumentException("Account name and type cannot be empty!");
        }
    }
}
