package com.novabank.service.impl;

import com.novabank.models.Account;
import com.novabank.models.Payment;
import com.novabank.models.PaymentRequest;
import com.novabank.models.Transact;
import com.novabank.models.TransferRequest;
import com.novabank.models.User;
import com.novabank.repository.AccountRepository;
import com.novabank.repository.PaymentRepository;
import com.novabank.repository.TransactRepository;
import com.novabank.service.TransactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;


@Service
public class TransactServiceImpl implements TransactService {

    private final AccountRepository accountRepository;
    private final TransactRepository transactRepository;
    private final PaymentRepository paymentRepository;

    @Autowired
    public TransactServiceImpl(AccountRepository accountRepository, TransactRepository transactRepository, PaymentRepository paymentRepository) {
        this.accountRepository = accountRepository;
        this.transactRepository = transactRepository;
        this.paymentRepository = paymentRepository;
    }

    @Transactional
    public ResponseEntity deposit(Map<String, String> requestMap, User user) {
        try {
            validateLoggedInUser(user);
            validateDepositRequest(requestMap);

            Long userId = user.getId();
            Account account = resolveUserAccount(userId, requestMap.get("account_id"));
            int accountId = account.getAccount_id();
            double depositAmount = Double.parseDouble(requestMap.get("deposit_amount"));

            double currentBalance = account.getBalance().doubleValue();
            double newBalance = currentBalance + depositAmount;

            accountRepository.changeAccountsBalanceById(newBalance, accountId);

            logTransaction(accountId, "deposit", depositAmount, "online", "success", "Deposit Transaction Successful");

            return ResponseEntity.ok(buildDepositResponse(userId));

        } catch (Exception e) {
            return handleException(e);
        }
    }

    @Transactional
    public ResponseEntity payment(PaymentRequest request, User user) {
        try {
            validateLoggedInUser(user);
            validatePaymentRequest(request);

            Long userId = user.getId();
            Account sourceAccount = resolveUserAccount(userId, request.getAccount_id());
            int accountId = sourceAccount.getAccount_id();
            double paymentAmount = Double.parseDouble(request.getPayment_amount());

            double currentBalance = sourceAccount.getBalance().doubleValue();

            if (currentBalance < paymentAmount) {
                handleInsufficientFunds(accountId);
                return ResponseEntity.badRequest().body("You have insufficient funds to perform this payment.");
            }

            double newBalance = currentBalance - paymentAmount;
            accountRepository.changeAccountsBalanceById(newBalance, accountId);

            Payment payment = new Payment();
            payment.setAccount_id(accountId);
            payment.setBeneficiary(request.getBeneficiary());
            payment.setBeneficiary_acc_no(request.getAccount_number());
            payment.setAmount(paymentAmount);
            payment.setReference_no(request.getReference());
            payment.setStatus("success");
            payment.setReason_code("Payment Transaction Successful");
            payment.setCreated_at(LocalDateTime.now());
            paymentRepository.save(payment);

            logTransaction(accountId, "Payment", paymentAmount, "online", "success", "Payment Transaction Successful");

            return ResponseEntity.ok(buildPaymentResponse(userId));

        } catch (Exception e) {
            return handleException(e);
        }
    }

    @Transactional
    public ResponseEntity withdraw(Map<String, String> requestMap, User user) {
        try {
            validateLoggedInUser(user);
            validateWithdrawalRequest(requestMap);

            Long userId = user.getId();
            Account account = resolveUserAccount(userId, requestMap.get("account_id"));
            int accountId = account.getAccount_id();
            double withdrawalAmount = Double.parseDouble(requestMap.get("withdrawal_amount"));

            double currentBalance = account.getBalance().doubleValue();

            if (currentBalance < withdrawalAmount) {
                handleInsufficientFunds(accountId);
                return ResponseEntity.badRequest().body("You have insufficient funds to perform this withdrawal.");
            }

            double newBalance = currentBalance - withdrawalAmount;
            accountRepository.changeAccountsBalanceById(newBalance, accountId);

            logTransaction(accountId, "Withdrawal", withdrawalAmount, "online", "success", "Withdrawal Transaction Successful");

            return ResponseEntity.ok(buildWithdrawalResponse(userId));

        } catch (Exception e) {
            return handleException(e);
        }
    }

    @Transactional
    public ResponseEntity transfer(TransferRequest request, User user) {
        try {
            validateLoggedInUser(user);
            validateTransferRequest(request);

            Long userId = user.getId();
            Account sourceAccount = resolveUserAccount(userId, request.getSourceAccount());
            Account targetAccount = resolveAccount(request.getTargetAccount());
            int sourceAccountId = sourceAccount.getAccount_id();
            int targetAccountId = targetAccount.getAccount_id();
            double transferAmount = Double.parseDouble(request.getAmount());

            if (sourceAccountId == targetAccountId) {
                return ResponseEntity.badRequest().body("Cannot transfer into the same account. Please select the appropriate account to perform the transfer.");
            }

            double sourceBalance = sourceAccount.getBalance().doubleValue();

            if (sourceBalance < transferAmount) {
                handleInsufficientFunds(sourceAccountId);
                return ResponseEntity.badRequest().body("You have insufficient funds to perform this transfer.");
            }

            double newSourceBalance = sourceBalance - transferAmount;
            double targetBalance = targetAccount.getBalance().doubleValue();
            double newTargetBalance = targetBalance + transferAmount;

            accountRepository.changeAccountsBalanceById(newSourceBalance, sourceAccountId);
            accountRepository.changeAccountsBalanceById(newTargetBalance, targetAccountId);

            logTransaction(sourceAccountId, "Transfer", transferAmount, "online", "success", "Transfer Transaction Successful");

            return ResponseEntity.ok(buildTransferResponse(userId));

        } catch (Exception e) {
            return handleException(e);
        }
    }

    private void validateDepositRequest(Map<String, String> requestMap) {
        String depositAmount = requestMap.get("deposit_amount");
        String accountID = requestMap.get("account_id");

        if (StringUtils.isEmpty(depositAmount) || StringUtils.isEmpty(accountID)) {
            throw new IllegalArgumentException("Deposit amount and account ID cannot be empty.");
        }

        double depositAmountValue = Double.parseDouble(depositAmount);

        if (depositAmountValue <= 0) {
            throw new IllegalArgumentException("Deposit amount must be greater than zero.");
        }
    }


    private void validatePaymentRequest(PaymentRequest request) {
        String beneficiary = request.getBeneficiary();
        String accountNumber = request.getAccount_number();
        String accountID = request.getAccount_id();
        String reference = request.getReference();
        String paymentAmount = request.getPayment_amount();

        if (StringUtils.isEmpty(beneficiary) || StringUtils.isEmpty(accountNumber) || StringUtils.isEmpty(accountID) || StringUtils.isEmpty(paymentAmount)) {
            throw new IllegalArgumentException("Beneficiary, account number, account paying from, and account payment amount cannot be empty.");
        }

        double paymentAmountValue = Double.parseDouble(paymentAmount);

        if (paymentAmountValue <= 0) {
            throw new IllegalArgumentException("Payment amount must be greater than zero.");
        }
    }


    private void validateWithdrawalRequest(Map<String, String> requestMap) {
        String withdrawalAmount = requestMap.get("withdrawal_amount");
        String accountId = requestMap.get("account_id");

        if (StringUtils.isEmpty(withdrawalAmount) || StringUtils.isEmpty(accountId)) {
            throw new IllegalArgumentException("Account withdrawing from and withdrawal amount cannot be empty!");
        }

        double withdrawal_amount = Double.parseDouble(withdrawalAmount);

        if (withdrawal_amount <= 0) {
            throw new IllegalArgumentException("Withdrawal amount must be greater than zero.");
        }
    }

    private void validateTransferRequest(TransferRequest request) {
        String transferFrom = request.getSourceAccount();
        String transferTo = request.getTargetAccount();
        String transferAmount = request.getAmount();

        if (StringUtils.isEmpty(transferFrom) || StringUtils.isEmpty(transferTo) || StringUtils.isEmpty(transferAmount)) {
            throw new IllegalArgumentException("The account transferring from, to, and the amount cannot be empty!");
        }

        double transferAmountValue = Double.parseDouble(transferAmount);

        if (transferAmountValue <= 0) {
            throw new IllegalArgumentException("Transfer amount must be greater than zero.");
        }
    }


    private void handleInsufficientFunds(int accountId) {
        logTransaction(accountId, "withdrawal", 0.0, "online", "failed", "Insufficient funds.");
    }

    private void validateLoggedInUser(User user) {
        if (user == null) {
            throw new IllegalArgumentException("You must login first.");
        }
    }

    private Account resolveUserAccount(Long userId, String accountIdentifier) {
        String normalizedIdentifier = normalizeAccountIdentifier(accountIdentifier);
        Account account = accountRepository.getUserAccountByIdOrNumber(userId, parseAccountId(normalizedIdentifier), normalizedIdentifier);
        if (account == null) {
            throw new IllegalArgumentException("Account not found for this user.");
        }
        return account;
    }

    private Account resolveAccount(String accountIdentifier) {
        String normalizedIdentifier = normalizeAccountIdentifier(accountIdentifier);
        Account account = accountRepository.getAccountByIdOrNumber(parseAccountId(normalizedIdentifier), normalizedIdentifier);
        if (account == null) {
            throw new IllegalArgumentException("Target account number was not found.");
        }
        return account;
    }

    private String normalizeAccountIdentifier(String accountIdentifier) {
        return accountIdentifier == null ? null : accountIdentifier.trim();
    }

    private Integer parseAccountId(String accountIdentifier) {
        if (accountIdentifier == null || !accountIdentifier.matches("\\d+")) {
            return null;
        }
        try {
            return Integer.parseInt(accountIdentifier);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private ResponseEntity handleException(Exception e) {
        if (e instanceof IllegalArgumentException || e instanceof NumberFormatException) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Transaction failed. Please try again.");
    }

    private void logTransaction(int accountId, String type, double amount, String source, String status, String reasonCode) {
        Transact transact = new Transact();
        transact.setAccount_id(accountId);
        transact.setTransaction_type(type);
        transact.setAmount(amount);
        transact.setSource(source);
        transact.setStatus(status);
        transact.setReason_code(reasonCode);
        transact.setCreated_at(LocalDateTime.now());
        transactRepository.save(transact);
    }

    private Map<String, Object> buildDepositResponse(Long userId) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Amount Deposited Successfully.");
        response.put("accounts", accountRepository.getUserAccountsById(userId));
        return response;
    }

    private Map<String, Object> buildPaymentResponse(Long userId) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Payment Processed Successfully!");
        response.put("accounts", accountRepository.getUserAccountsById(userId));
        return response;
    }

    private Map<String, Object> buildWithdrawalResponse(Long userId) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Withdrawal Successful!");
        response.put("accounts", accountRepository.getUserAccountsById(userId));
        return response;
    }

    private Map<String, Object> buildTransferResponse(Long userId) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Transfer Completed Successfully.");
        response.put("accounts", accountRepository.getUserAccountsById(userId));
        return response;
    }
}
