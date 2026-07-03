package io.github.ruinakayama.learning_share_api.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank @Size(max = 50) String name,
    @NotBlank @Email String email,
    @NotBlank String password) {
}
