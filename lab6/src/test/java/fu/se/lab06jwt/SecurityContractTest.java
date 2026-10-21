package fu.se.lab06jwt;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import fu.se.lab06jwt.entities.User;
import fu.se.lab06jwt.repositories.UserRepository;
import fu.se.lab06jwt.services.JwtService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Date;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.greaterThan;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SecurityContractTest {
    private static final String EMAIL = "student01@fpt.edu.vn";
    private static final String PASSWORD = "P@ssword123";

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;
    @Autowired UserRepository repository;
    @Autowired PasswordEncoder encoder;
    @Autowired JwtService jwtService;
    @Value("${security.jwt.secret-key}") String secret;

    @BeforeEach
    void cleanDatabase() {
        repository.deleteAll();
    }

    @Test
    void signup_returns201AndPersistsOnlyBcryptHash() throws Exception {
        signup(EMAIL, PASSWORD)
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.fullName").value("SBA301 Student"))
                .andExpect(jsonPath("$.email").value(EMAIL))
                .andExpect(jsonPath("$.createdAt").isNotEmpty())
                .andExpect(jsonPath("$.updatedAt").isNotEmpty())
                .andExpect(jsonPath("$.password").doesNotExist())
                .andExpect(jsonPath("$.authorities").doesNotExist());
        User saved = repository.findByEmail(EMAIL).orElseThrow();
        assertThat(saved.getPassword()).isNotEqualTo(PASSWORD).startsWith("$2");
        assertThat(encoder.matches(PASSWORD, saved.getPassword())).isTrue();
        assertThat(repository.count()).isEqualTo(1);
    }

    @Test
    void duplicateSignup_returns409AndDoesNotInsert() throws Exception {
        signup(EMAIL, PASSWORD).andExpect(status().isCreated());
        signup(EMAIL.toUpperCase(java.util.Locale.ROOT), PASSWORD)
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Email already exists"));
        assertThat(repository.count()).isEqualTo(1);
    }

    @Test
    void loginToken_authenticatesCorrectPrincipalAndDoesNotCreateSession() throws Exception {
        signup(EMAIL.toUpperCase(java.util.Locale.ROOT), PASSWORD).andExpect(status().isCreated());
        String loginBody = mvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("email", EMAIL, "password", PASSWORD))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.expiresIn").value(3600000))
                .andExpect(jsonPath("$.expiresIn", greaterThan(0)))
                .andReturn().getResponse().getContentAsString();
        String token = mapper.readTree(loginBody).get("token").asText();
        assertThat(token.split("\\.")).hasSize(3);
        assertThat(jwtService.extractUsername(token)).isEqualTo(EMAIL);
        assertThat(jwtService.extractClaim(token, claims -> claims.getExpiration().getTime())
                - jwtService.extractClaim(token, claims -> claims.getIssuedAt().getTime()))
                .isEqualTo(3600000);

        var result = mvc.perform(get("/users/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(EMAIL))
                .andExpect(jsonPath("$.password").doesNotExist())
                .andReturn();
        assertThat(result.getRequest().getSession(false)).isNull();
        assertThat(result.getResponse().getCookie("JSESSIONID")).isNull();
        // A previous valid request must not authenticate the next request.
        mvc.perform(get("/users/me")).andExpect(status().isUnauthorized());
    }

    @Test
    void usersList_allowsAuthenticatedCoreUserWithoutLeakingCredentials() throws Exception {
        signup(EMAIL, PASSWORD).andExpect(status().isCreated());
        signup("student02@fpt.edu.vn", PASSWORD).andExpect(status().isCreated());
        String body = mvc.perform(get("/users").header("Authorization", "Bearer " + login()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andReturn().getResponse().getContentAsString();
        for (JsonNode user : mapper.readTree(body)) {
            assertThat(user.has("password")).isFalse();
            assertThat(user.has("username")).isFalse();
            assertThat(user.has("authorities")).isFalse();
            assertThat(user.size()).isEqualTo(5);
        }
        assertThat(body).doesNotContain("$2", PASSWORD);
    }

    @Test
    void badPasswordAndUnknownEmail_returnSame401WithoutToken() throws Exception {
        signup(EMAIL, PASSWORD).andExpect(status().isCreated());
        for (String email : new String[]{EMAIL, "missing@fpt.edu.vn"}) {
            mvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
                            .content(json(Map.of("email", email, "password", "wrong-password"))))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.message").value("Invalid email or password"))
                    .andExpect(jsonPath("$.token").doesNotExist());
        }
    }

    @ParameterizedTest
    @ValueSource(strings = {"/users/me", "/users"})
    void protectedEndpointWithoutToken_returns401(String path) throws Exception {
        mvc.perform(get(path)).andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Authentication required"));
    }

    @ParameterizedTest
    @ValueSource(strings = {"Bearer abc", "Bearer ", "Basic abc", "Bearer a.b.c"})
    void malformedOrWrongScheme_returns401(String authorization) throws Exception {
        mvc.perform(get("/users/me").header("Authorization", authorization))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void tamperedSignature_returns401() throws Exception {
        signup(EMAIL, PASSWORD).andExpect(status().isCreated());
        String token = login();
        int signatureStart = token.lastIndexOf('.') + 1;
        char replacement = token.charAt(signatureStart) == 'A' ? 'B' : 'A';
        String tampered = token.substring(0, signatureStart) + replacement
                + token.substring(signatureStart + 1);
        mvc.perform(get("/users/me").header("Authorization", "Bearer " + tampered))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid or expired token"));
    }

    @Test
    void expiredToken_returns401() throws Exception {
        signup(EMAIL, PASSWORD).andExpect(status().isCreated());
        String token = Jwts.builder().subject(EMAIL)
                .issuedAt(new Date(System.currentTimeMillis() - 120000))
                .expiration(new Date(System.currentTimeMillis() - 60000))
                .signWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret))).compact();
        mvc.perform(get("/users/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid or expired token"));
    }

    @Test
    void signedTokenForDeletedUser_returns401() throws Exception {
        signup(EMAIL, PASSWORD).andExpect(status().isCreated());
        String token = login();
        repository.deleteAll();
        mvc.perform(get("/users/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void signedTokenWithoutExpiration_returns401() throws Exception {
        signup(EMAIL, PASSWORD).andExpect(status().isCreated());
        String token = Jwts.builder().subject(EMAIL)
                .signWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret))).compact();
        mvc.perform(get("/users/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized());
    }

    @ParameterizedTest
    @ValueSource(strings = {"bad-email", "", "a@"})
    void invalidEmail_returns400WithoutInsert(String email) throws Exception {
        signup(email, PASSWORD).andExpect(status().isBadRequest());
        assertThat(repository.count()).isZero();
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "       ", "short", "abcdefg"})
    void invalidSignupPassword_returns400WithoutInsert(String password) throws Exception {
        signup(EMAIL, password).andExpect(status().isBadRequest());
        assertThat(repository.count()).isZero();
    }

    @Test
    void passwordOverBcryptByteLimit_returns400WithoutInsert() throws Exception {
        signup(EMAIL, "a".repeat(73)).andExpect(status().isBadRequest());
        signup(EMAIL, "\u1eaf".repeat(25)).andExpect(status().isBadRequest());
        assertThat(repository.count()).isZero();
    }

    @Test
    void blankFullNameAndMalformedJson_return400() throws Exception {
        mvc.perform(post("/auth/signup").contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("fullName", " ", "email", EMAIL, "password", PASSWORD))))
                .andExpect(status().isBadRequest());
        mvc.perform(post("/auth/signup").contentType(MediaType.APPLICATION_JSON).content("{"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid JSON request"));
        assertThat(repository.count()).isZero();
    }

    private org.springframework.test.web.servlet.ResultActions signup(String email, String password)
            throws Exception {
        return mvc.perform(post("/auth/signup").contentType(MediaType.APPLICATION_JSON)
                .content(json(Map.of("fullName", " SBA301 Student ",
                        "email", email, "password", password))));
    }

    private String login() throws Exception {
        String response = mvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("email", EMAIL, "password", PASSWORD))))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        return mapper.readTree(response).get("token").asText();
    }

    private String json(Object value) throws Exception {
        return mapper.writeValueAsString(value);
    }
}
