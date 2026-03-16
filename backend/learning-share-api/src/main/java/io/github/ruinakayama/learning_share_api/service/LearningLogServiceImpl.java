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
import io.github.ruinakayama.learning_share_api.exception.BadRequestException;

@Service
public class LearningLogServiceImpl implements LearningLogService {

  private final LearningLogRepository learningLogRepository;

  public LearningLogServiceImpl(LearningLogRepository learningLogRepository) {
    this.learningLogRepository = learningLogRepository;
  }

  private void validateCreateRequest(CreateLogRequest req) {
    if (req.title() == null || req.title().isBlank()) {
      throw new BadRequestException("title is required");
    }
    if (req.minutes() == null) {
      throw new BadRequestException("minutes is required");
    }
    if (req.minutes() < 0) {
      throw new BadRequestException("minutes must be greater than or equal to 0");
    }

    if (req.visibility() == null) {
      throw new BadRequestException("visibility is required");
    }
  }

  // 学習ログ作成処理
  @Override
  public CreateLogResponse create(Long userId, CreateLogRequest req) {
    // バリデーションチェック
    validateCreateRequest(req);

    // 作成日時
    OffsetDateTime now = OffsetDateTime.now();
    // visibilityがLINK/PUBLICのときだけtoken発行（仕様）
    String shareToken = switch (req.visibility()) {
      case LINK, PUBLIC -> UUID.randomUUID().toString();
      case PRIVATE -> null;
    };

    // 1) まず1回目の保存（id確定させる）
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
    if (entity.getVisibility() == Visibility.PUBLIC) {
      saved.setSlug(saved.getId().toString());
      saved.setUpdatedAt(OffsetDateTime.now());
      saved = learningLogRepository.save(saved);
    }

    return new CreateLogResponse(
        saved.getId(),
        saved.getTitle(),
        saved.getContent(),
        saved.getMinutes(),
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
        entity.getTitle(),
        entity.getContent(),
        entity.getMinutes(),
        entity.getSlug(),
        entity.getShareToken(),
        entity.getVisibility(),
        entity.getCreatedAt(),
        entity.getUpdatedAt());
  }
}
