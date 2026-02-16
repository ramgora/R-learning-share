package io.github.ruinakayama.learning_share_api.dto.log;

import java.time.OffsetDateTime;

public record CreateLogResponse(
    Long id,
    String slug,
    String shareToken,
    String visibility,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt) {
}
