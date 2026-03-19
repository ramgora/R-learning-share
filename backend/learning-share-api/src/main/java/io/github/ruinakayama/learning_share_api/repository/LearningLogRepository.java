package io.github.ruinakayama.learning_share_api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import io.github.ruinakayama.learning_share_api.domain.LearningLogEntity;

public interface LearningLogRepository extends JpaRepository<LearningLogEntity, Long> {
  Optional<LearningLogEntity> findByShareToken(String shareToken);

  List<LearningLogEntity> findByUserIdOrderByCreatedAtDesc(Long userid);
}
