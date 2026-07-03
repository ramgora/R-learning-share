package io.github.ruinakayama.learning_share_api.service;

import io.github.ruinakayama.learning_share_api.dto.auth.LoginRequest;
import io.github.ruinakayama.learning_share_api.dto.auth.RegisterRequest;

public interface AuthService {

  Long login(LoginRequest req);

  Long register(RegisterRequest req);
}
