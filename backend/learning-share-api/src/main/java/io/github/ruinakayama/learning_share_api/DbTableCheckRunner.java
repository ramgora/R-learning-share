package io.github.ruinakayama.learning_share_api;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import io.github.ruinakayama.learning_share_api.repository.UserRepository;

@Component
public class DbTableCheckRunner implements CommandLineRunner {

  private final UserRepository userRepository;

  public DbTableCheckRunner(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public void run(String... args) {
    System.out.println("[DB CHECK] users count = " + userRepository.count());
  }
}
