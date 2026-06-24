package io.github.ruinakayama.learning_share_api.dto.log;

import java.time.OffsetDateTime;

public record CreateLogResponse(
    Long id,
    String title,
    String content,
    Integer minutes,
    String slug,
    String shareToken,
    Visibility visibility,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt) {
}
