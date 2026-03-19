package io.github.ruinakayama.learning_share_api.dto.log;

import java.time.OffsetDateTime;

public record LogSummaryResponse(
    Long id,
    String title,
    Visibility visibility,
    String contentPreview, // 一覧表示用の要約された内容
    Integer minutes,
    String slug,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt) {

}
