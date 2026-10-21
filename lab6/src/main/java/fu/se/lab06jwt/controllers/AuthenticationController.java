package fu.se.lab06jwt.controllers;

import fu.se.lab06jwt.dtos.LoginUserDto;
import fu.se.lab06jwt.dtos.RegisterUserDto;
import fu.se.lab06jwt.entities.User;
import fu.se.lab06jwt.responses.LoginResponse;
import fu.se.lab06jwt.responses.UserResponse;
import fu.se.lab06jwt.services.AuthenticationService;
import fu.se.lab06jwt.services.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signup")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterUserDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(UserResponse.from(authenticationService.signup(dto)));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@Valid @RequestBody LoginUserDto dto) {
        User user = authenticationService.authenticate(dto);
        return ResponseEntity.ok(new LoginResponse(
                jwtService.generateToken(user), jwtService.getExpirationTime()));
    }
}
