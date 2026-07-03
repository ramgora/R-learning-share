package io.github.ruinakayama.learning_share_api.service;

import java.time.OffsetDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import io.github.ruinakayama.learning_share_api.domain.UserEntity;
import io.github.ruinakayama.learning_share_api.dto.auth.LoginRequest;
import io.github.ruinakayama.learning_share_api.dto.auth.RegisterRequest;
import io.github.ruinakayama.learning_share_api.exception.BadRequestException;
import io.github.ruinakayama.learning_share_api.exception.UnauthorizedException;
import io.github.ruinakayama.learning_share_api.repository.UserRepository;

@Service
public class AuthServiceImpl implements AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public Long login(LoginRequest req) {
    UserEntity user = userRepository.findByEmail(req.email())
        .orElseThrow(() -> new UnauthorizedException("invalid email or password"));

    if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
      throw new UnauthorizedException("invalid email or password");
    }

    return user.getId();
  }

  @Override
  public Long register(RegisterRequest req) {
    if (userRepository.existsByEmail(req.email())) {
      throw new BadRequestException("このメールアドレスは登録できません。");
    }
    if (userRepository.existsByName(req.name())) {
      throw new BadRequestException("この名前は登録できません。");
    }

    UserEntity user = new UserEntity();
    user.setName(req.name());
    user.setEmail(req.email());
    user.setPasswordHash(passwordEncoder.encode(req.password()));
    user.setCreatedAt(OffsetDateTime.now());
    return userRepository.save(user).getId();
  }
}
