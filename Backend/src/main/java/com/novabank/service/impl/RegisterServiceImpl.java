package com.novabank.service.impl;

import com.novabank.helpers.HTML;
import com.novabank.helpers.Token;
import com.novabank.mail.MailMessenger;
import com.novabank.models.User;
import com.novabank.repository.UserRepository;
import com.novabank.service.RegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.UUID;

@Service
public class RegisterServiceImpl implements RegisterService {

    @Autowired
    private UserRepository userRepository;
    @Override
    public ResponseEntity<?> registerUser(User user ,String confirmPassword) {
        String firstName = user.getFirst_name();
        String lastName = user.getLast_name();
        String email = user.getEmail();
        String password = user.getPassword();

        if(!password.equals(confirmPassword))
            return ResponseEntity.badRequest().body("Passwords do not match.");

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email cannot be empty.");
        }

        String existingEmail = userRepository.getUserEmail(email.trim());
        if (existingEmail != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists.");
        }

        String userId = UUID.randomUUID().toString();
        String token = Token.generateToken();
        int code = generateRandomCode();
        String emailBody = HTML.htmlEmailTemplate(token, Integer.toString(code));
        String hashed_password = BCrypt.hashpw(password, BCrypt.gensalt());

        try {
            userRepository.registerUser(userId, firstName, lastName, email.trim(), hashed_password, token, Integer.toString(code));
        } catch (Exception e) {
            String message = e.getMessage() != null ? e.getMessage() : "Unable to register user.";
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed: " + message);
        }

        boolean emailSent = sendEmailNotification(email.trim(), emailBody);
        if (!emailSent) {
            userRepository.verifyAccount(token, Integer.toString(code));
        }

        Map<String, Object> response = createResponse(user, emailSent);
        return ResponseEntity.ok(response);
    }

    private static Map<String, Object> createResponse(User user, boolean emailSent) {
        //TODO: RETURN REGISTIRATION SUCCESS
        Map<String, Object> response = new HashMap<>();
        if (emailSent) {
            response.put("message", "Registration success. Please check your email and verify your account.");
        } else {
            response.put("message", "Registration success. Account auto-verified for local development.");
        }
        response.put("user", user); // veya başka verileri ekleyebilirsiniz
        return response;
    }

    private static boolean sendEmailNotification(String email, String emailBody) {
        // Keep local development resilient when SMTP is not configured.
        try {
            MailMessenger.htmlEmailMessenger("user@novabank.com", email, "Verify Account", emailBody);
            return true;
        } catch (Exception e) {
            System.err.println("Email delivery skipped for local run: " + e.getMessage());
            return false;
        }
    }

    private static int generateRandomCode() {
        //TODO: GENERATE RANDOM CODE:
        Random rand = new Random();
        int bound = 123;
        int code = bound * rand.nextInt(bound);
        return code;
    }
}
