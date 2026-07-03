package io.github.ruinakayama.learning_share_api.repository;

import io.github.ruinakayama.learning_share_api.domain.UserEntity;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

  boolean existsByEmail(String email);

  boolean existsByName(String name);

  Optional<UserEntity> findByEmail(String email);

  Optional<UserEntity> findByName(String name);

}
