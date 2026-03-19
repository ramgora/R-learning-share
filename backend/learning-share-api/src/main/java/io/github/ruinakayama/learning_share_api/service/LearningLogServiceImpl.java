package io.github.ruinakayama.learning_share_api.service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import io.github.ruinakayama.learning_share_api.domain.LearningLogEntity;
import io.github.ruinakayama.learning_share_api.dto.log.CreateLogRequest;
import io.github.ruinakayama.learning_share_api.dto.log.CreateLogResponse;
import io.github.ruinakayama.learning_share_api.dto.log.LogSummaryResponse;
import io.github.ruinakayama.learning_share_api.dto.log.Visibility;
import io.github.ruinakayama.learning_share_api.exception.NotFoundException;
import io.github.ruinakayama.learning_share_api.repository.LearningLogRepository;
import io.github.ruinakayama.learning_share_api.exception.BadRequestException;

@Service
public class LearningLogServiceImpl implements LearningLogService {

  // 一覧に表示する際の内容の出力文字数
  private static final int CONTENT_PREVIEW_LENGTH = 60;

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

    // 万が一PRIVATEの場合でもtokenが入ってしまった場合のガード
    if (entity.getVisibility() == Visibility.PRIVATE) {
      throw new NotFoundException("log not found");
    }

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

  /* 学習ログ一覧取得処理 */
  @Override
  public List<LogSummaryResponse> getMyLogs(Long userId) {
    // 学習ログの取得
    List<LearningLogEntity> logs = learningLogRepository.findByUserIdOrderByCreatedAtDesc(userId);

    // 取得した Entity 一覧を、APIレスポンス用の DTO 一覧へ変換して返す
    return logs.stream()
        // 各 Entity を 1件ずつ LogSummaryResponse に変換する
        .map(this::toLogSummaryResponse)
        // Stream の結果を List にまとめる
        .toList();
  }

  // Entity を一覧表示用DTOに変換する
  private LogSummaryResponse toLogSummaryResponse(LearningLogEntity entity) {
    return new LogSummaryResponse(
        entity.getId(),
        entity.getTitle(),
        entity.getVisibility(),
        buildContentPreview(entity.getContent()),
        entity.getMinutes(),
        entity.getSlug(),
        entity.getCreatedAt(),
        entity.getUpdatedAt());
  }

  // 一覧カード表示用に、本文整形処理
  private String buildContentPreview(String content) {
    if (content == null) {
      return "";
    }
    // 指定文字数以内ならそのまま返す
    if (content.length() <= CONTENT_PREVIEW_LENGTH) {
      return content;
    }
    // 指定文字数を超える場合は、省略記号をつけて返す
    return content.substring(0, CONTENT_PREVIEW_LENGTH) + "...";
  }
}
