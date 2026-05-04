package com.novabank.helpers;

import java.security.SecureRandom;
import java.util.Base64;

public class Token {
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    public static String generateToken(){
        byte[] tokenBytes = new byte[32];
        SECURE_RANDOM.nextBytes(tokenBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
    }
}
