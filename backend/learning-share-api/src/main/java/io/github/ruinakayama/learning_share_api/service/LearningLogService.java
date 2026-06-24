package io.github.ruinakayama.learning_share_api.service;

import java.util.List;

import io.github.ruinakayama.learning_share_api.dto.log.CreateLogRequest;
import io.github.ruinakayama.learning_share_api.dto.log.CreateLogResponse;
import io.github.ruinakayama.learning_share_api.dto.log.LogDetailResponse;
import io.github.ruinakayama.learning_share_api.dto.log.LogSummaryResponse;
import io.github.ruinakayama.learning_share_api.dto.log.UpdateLogRequest;

public interface LearningLogService {

  // 学習ログを新規作成する
  CreateLogResponse create(Long userId, CreateLogRequest req);

  // shareToken を使って共有ログを取得する
  CreateLogResponse getByShareToken(String token);

  // ログイン中ユーザー自身の学習ログ一覧を取得する
  List<LogSummaryResponse> getMyLogs(Long userId);

  // 学習ログ詳細画面を取得する
  LogDetailResponse getLogDetail(Long userId, Long logId);

  // 学習ログを更新する
  CreateLogResponse update(Long userId, Long logId, UpdateLogRequest req);

  // 学習ログを削除する
  void deleteLog(Long userId, Long logId);
}
