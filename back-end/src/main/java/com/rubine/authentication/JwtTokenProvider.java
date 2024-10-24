package com.rubine.authentication;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.security.KeyFactory;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtTokenProvider {
    private final RSAPrivateKey privateKey;
    private final RSAPublicKey publicKey;

    public JwtTokenProvider(@Value("${rsa.private-key}") String privateKeyContent,
                            @Value("${rsa.public-key}") String publicKeyContent) throws Exception {
        byte[] privateKeyBytes = Base64.getDecoder().decode(privateKeyContent);
        PKCS8EncodedKeySpec privateKeySpec = new PKCS8EncodedKeySpec(privateKeyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        this.privateKey = (RSAPrivateKey) keyFactory.generatePrivate(privateKeySpec);

        byte[] publicKeyBytes = Base64.getDecoder().decode(publicKeyContent);
        X509EncodedKeySpec publicKeySpec = new X509EncodedKeySpec(publicKeyBytes);
        this.publicKey = (RSAPublicKey) keyFactory.generatePublic(publicKeySpec);
    }

    public String generateToken(UserDetails userDetails) {
        long EXPIRATION_TIME = 86400000;
        return JWT.create()
                .withSubject(userDetails.getUsername())
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(Algorithm.RSA256(publicKey, privateKey));
    }

    public boolean validateToken(String token) {
        try {
            JWT.require(Algorithm.RSA256(publicKey, privateKey))
                    .build()
                    .verify(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        return JWT.decode(token).getSubject();
    }

}
