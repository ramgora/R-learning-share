package io.github.ruinakayama.learning_share_api.repository;

import io.github.ruinakayama.learning_share_api.domain.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

}
