package fu.se.lab06jwt.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    private final SecretKey signingKey;
    private final long jwtExpiration;

    public JwtService(@Value("${security.jwt.secret-key}") String secretKey,
                      @Value("${security.jwt.expiration-time}") long jwtExpiration) {
        // Validate Base64/key strength at startup, before accepting requests.
        this.signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
        if (jwtExpiration <= 0) {
            throw new IllegalArgumentException("JWT expiration time must be positive");
        }
        this.jwtExpiration = jwtExpiration;
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        return resolver.apply(extractAllClaims(token));
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(Map.of(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(now))
                .expiration(new Date(now + jwtExpiration))
                .signWith(signingKey)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        Claims claims = extractAllClaims(token);
        Date expiration = claims.getExpiration();
        return userDetails.getUsername().equals(claims.getSubject())
                && expiration != null && expiration.after(new Date());
    }

    public long getExpirationTime() {
        return jwtExpiration;
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser().verifyWith(signingKey).build()
                .parseSignedClaims(token).getPayload();
    }
}
