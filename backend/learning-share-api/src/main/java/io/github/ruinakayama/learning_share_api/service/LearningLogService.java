package io.github.ruinakayama.learning_share_api.service;

import java.util.List;

import io.github.ruinakayama.learning_share_api.dto.log.CreateLogRequest;
import io.github.ruinakayama.learning_share_api.dto.log.CreateLogResponse;
import io.github.ruinakayama.learning_share_api.dto.log.LogSummaryResponse;

public interface LearningLogService {

  // 学習ログを新規作成する
  CreateLogResponse create(Long userId, CreateLogRequest req);

  // shareToken を使って共有ログを取得する
  CreateLogResponse getByShareToken(String token);

  // ログイン中ユーザー自身の学習ログ一覧を取得する
  List<LogSummaryResponse> getMyLogs(Long userId);
}
