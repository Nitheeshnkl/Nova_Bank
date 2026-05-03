package com.novabank.helpers.authorization;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


import java.util.Date;

@Service
public class JwtService {
    @Value("${novabank.app.secret}")
    private String appSecret;

    @Value("${novabank.app.expires.in}")
    private long expiresIn;


    public String generateToken(String userEmail) {
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + expiresIn);

        return Jwts.builder()
                .setSubject(userEmail)
                .setIssuedAt(now)
                .setExpiration(expirationDate)
                .signWith(SignatureAlgorithm.HS256,appSecret)
                .compact();

    }

    public Claims decodeToken(String token) {
        try {
            Jws<Claims> claimsJws = Jwts.parser()
                    .setSigningKey(appSecret)
                    .parseClaimsJws(token);
            return claimsJws.getBody();
        } catch (Exception e) {
            System.out.println("Token is not valid.");
            return null;
        }
    }

    public boolean isTokenIncluded(String req){
        return req != null && !req.trim().isEmpty() && req.toLowerCase().startsWith("bearer");
    }

    public String getAccessTokenFromHeader(String req){
        if (req == null) {
            return null;
        }

        String token = req.replaceFirst("^[Bb]earer:?\\s+", "").trim();
        if (token.isEmpty() || token.equals(req.trim())) {
            return null;
        }
        return token;
    }






}
