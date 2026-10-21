package fu.se.lab06jwt.responses;

import fu.se.lab06jwt.entities.User;

import java.util.Date;

public record UserResponse(Integer id, String fullName, String email,
                           Date createdAt, Date updatedAt) {
    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getFullName(), user.getEmail(),
                user.getCreatedAt(), user.getUpdatedAt());
    }
}
