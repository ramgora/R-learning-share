package io.github.ruinakayama.learning_share_api.service;

import java.time.OffsetDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;

import io.github.ruinakayama.learning_share_api.domain.LearningLogEntity;
import io.github.ruinakayama.learning_share_api.dto.log.CreateLogRequest;
import io.github.ruinakayama.learning_share_api.dto.log.CreateLogResponse;
import io.github.ruinakayama.learning_share_api.dto.log.Visibility;
import io.github.ruinakayama.learning_share_api.exception.NotFoundException;
import io.github.ruinakayama.learning_share_api.repository.LearningLogRepository;

@Service
public class LearningLogServiceImpl implements LearningLogService {

  private final LearningLogRepository learningLogRepository;

  public LearningLogServiceImpl(LearningLogRepository learningLogRepository) {
    this.learningLogRepository = learningLogRepository;
  }

  @Override
  public CreateLogResponse create(Long userId, CreateLogRequest req) {
    OffsetDateTime now = OffsetDateTime.now();

    // visibilityがLINK/PUBLICのときだけtoken発行（仕様）
    String shareToken = switch (req.visibility()) {
      case LINK, PUBLIC -> UUID.randomUUID().toString();
      case PRIVATE -> null;
    };

    // 1) まず保存（id確定させる）
    LearningLogEntity entity = new LearningLogEntity();
    entity.setUserId(userId);
    entity.setTitle(req.title());
    entity.setContent(req.content());
    entity.setMinutes(req.minutes());
    entity.setVisibility(req.visibility());
    entity.setShareToken(shareToken);
    entity.setCreatedAt(now);
    entity.setUpdatedAt(now);

    LearningLogEntity saved = learningLogRepository.save(entity);

    // 2) slugはPUBLICだけ必要。最短でslug = id文字列
    if (saved.getVisibility() == Visibility.PUBLIC) {
      saved.setSlug(saved.getId().toString());
      saved.setUpdatedAt(OffsetDateTime.now());
      saved = learningLogRepository.save(saved);
    }

    return new CreateLogResponse(
        saved.getId(),
        saved.getSlug(),
        saved.getShareToken(),
        saved.getVisibility(),
        saved.getCreatedAt(),
        saved.getUpdatedAt());
  }

  @Override
  public CreateLogResponse getByShareToken(String token) {
    LearningLogEntity entity = learningLogRepository.findByShareToken(token)
        .orElseThrow(() -> new NotFoundException("log not found"));

    return new CreateLogResponse(
        entity.getId(),
        entity.getSlug(),
        entity.getShareToken(),
        entity.getVisibility(),
        entity.getCreatedAt(),
        entity.getUpdatedAt());
  }
}
