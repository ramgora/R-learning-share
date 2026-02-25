package io.github.ruinakayama.learning_share_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import io.github.ruinakayama.learning_share_api.domain.LearningLogEntity;

public interface LearningLogRepository extends JpaRepository<LearningLogEntity, Long> {

}
