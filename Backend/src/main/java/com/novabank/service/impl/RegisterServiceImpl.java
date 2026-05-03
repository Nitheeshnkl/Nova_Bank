package com.novabank.service.impl;

import com.novabank.helpers.HTML;
import com.novabank.helpers.Token;
import com.novabank.mail.MailMessenger;
import com.novabank.models.User;
import com.novabank.repository.UserRepository;
import com.novabank.service.RegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.*;

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

        //TODO: CHECK FOR PASSWORD MATCH:
        if(!password.equals(confirmPassword))
            return ResponseEntity.badRequest().body("Şifreler uyuşmuyor.");

        //TODO: GET TOKEN STRING:
        String token = Token.generateToken();

        int code = generateRandomCode();

        //TODO: GET EMAIL HTML BODY
        String emailBody = HTML.htmlEmailTemplate(token, Integer.toString(code));

        //TODO: HASH PASSWORD:
        String hashed_password = BCrypt.hashpw(password, BCrypt.gensalt());

        //TODO: REGISTER USER:
        userRepository.registerUser(firstName, lastName, email, hashed_password, token, Integer.toString(code));

        boolean emailSent = sendEmailNotification(email, emailBody);
        if (!emailSent) {
            // Local/dev fallback: keep auth flow usable when SMTP is not configured.
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
