package io.github.ruinakayama.learning_share_api.dto.log;

import java.time.OffsetDateTime;

public record LogDetailResponse(
    Long id,
    String title,
    String content,
    Integer minutes,
    Visibility visibility,
    String slug,
    String shareToken,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt) {
}
