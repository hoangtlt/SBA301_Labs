package fu.se.lab06jwt.controllers;

import fu.se.lab06jwt.entities.User;
import fu.se.lab06jwt.responses.UserResponse;
import fu.se.lab06jwt.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(UserResponse.from(user));
    }

    @GetMapping
    public List<UserResponse> allUsers() {
        return userService.allUsers().stream().map(UserResponse::from).toList();
    }
}
