package com.novabank.controllers;


import com.novabank.repository.UserRepository;
import com.novabank.service.IndexService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class IndexController {

    @Autowired
    private IndexService indexService;

    @GetMapping("/")
    public String getIndex(){
        return "Merhaba, Spring Boot JSON örnegi!";
    }

    @GetMapping("/verify")
    public ResponseEntity<?> getVerify(@RequestParam("token")String token, @RequestParam("code")String code){

        return indexService.getVerify(token, code);
    }
}
