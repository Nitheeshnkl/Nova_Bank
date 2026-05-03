package com.novabank.controllers;


import com.novabank.helpers.GenAccountNumber;
import com.novabank.repository.AccountRepository;
import com.novabank.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import com.novabank.models.User;

import javax.servlet.http.HttpSession;
import java.util.Map;

@Controller
@RequestMapping("/account")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @PostMapping("/create_account")
    public ResponseEntity createAccount(@RequestBody Map<String, String> requestMap, HttpSession session) {
        // TODO: GET LOGGED IN USER:
        User user = (User) session.getAttribute("user");

        if (user == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You must login first."); // 401 Unauthorized

        return accountService.createAccount(requestMap, user);
    }
}
