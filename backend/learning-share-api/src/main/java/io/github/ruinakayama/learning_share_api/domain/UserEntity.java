package io.github.ruinakayama.learning_share_api.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")

public class UserEntity {
  @Id
  private Long id;
}
