package io.github.ruinakayama.learning_share_api.service;

import java.time.OffsetDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;

import io.github.ruinakayama.learning_share_api.dto.log.CreateLogRequest;
import io.github.ruinakayama.learning_share_api.dto.log.CreateLogResponse;

@Service
public class LearningLogServiceImpl implements LearningLogService {

  @Override
  public CreateLogResponse create(Long userId, CreateLogRequest req) {
    OffsetDateTime now = OffsetDateTime.now();
    return new CreateLogResponse(
        1L,
        "dummy-slung",
        UUID.randomUUID().toString(),
        req.visibility(),
        now,
        now);
  }

}
