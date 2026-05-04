package com.novabank.service.impl;

import com.novabank.models.Account;
import com.novabank.models.PaymentHistory;
import com.novabank.models.TransactionHistory;
import com.novabank.models.User;
import com.novabank.repository.AccountRepository;
import com.novabank.repository.PaymentHistoryRepository;
import com.novabank.repository.TransactHistoryRepository;
import com.novabank.service.AppService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AppServiceImpl implements AppService {

    private final AccountRepository accountRepository;
    private final PaymentHistoryRepository paymentHistoryRepository;
    private final TransactHistoryRepository transactHistoryRepository;

    @Autowired
    public AppServiceImpl(AccountRepository accountRepository, PaymentHistoryRepository paymentHistoryRepository, TransactHistoryRepository transactHistoryRepository) {
        this.accountRepository = accountRepository;
        this.paymentHistoryRepository = paymentHistoryRepository;
        this.transactHistoryRepository = transactHistoryRepository;
    }

    @Override
    public ResponseEntity<?> getDashboard(User user) {
        try {
            Long userId = user.getId();
            List<Account> userAccounts = accountRepository.getUserAccountsById(userId);
            BigDecimal totalAccountsBalance = accountRepository.getTotalBalance(userId);
            if (totalAccountsBalance == null) {
                totalAccountsBalance = BigDecimal.ZERO;
            }

            Map<String, Object> response = new HashMap<>();
            response.put("userAccounts", userAccounts);
            response.put("totalBalance", totalAccountsBalance);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching dashboard data: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> getPaymentHistory(User user) {
        try {
            Long userId = user.getId();
            List<PaymentHistory> userPaymentHistory = paymentHistoryRepository.getPaymentsRecordsById(userId);

            Map<String, List> response = new HashMap<>();
            response.put("payment_history", userPaymentHistory);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching payment history: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> getTransactionHistory(User user) {
        try {
            Long userId = user.getId();
            List<TransactionHistory> userTransactionHistory = transactHistoryRepository.getTransactionRecordsById(userId);

            Map<String, List> response = new HashMap<>();
            response.put("transaction_history", userTransactionHistory);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching transaction history: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> getAccountTransactionHistory(Map<String, String> requestMap) {
        try {
            String account_id = requestMap.get("account_id");
            int accountId = Integer.parseInt(account_id);

            List<TransactionHistory> accountTransactionHistory = transactHistoryRepository.getTransactionRecordsByAccountId(accountId);

            Map<String, List> response = new HashMap<>();
            response.put("transaction_history", accountTransactionHistory);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching account transaction history: " + e.getMessage());
        }
    }
}
