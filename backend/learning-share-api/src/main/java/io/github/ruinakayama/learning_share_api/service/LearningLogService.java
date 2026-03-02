package io.github.ruinakayama.learning_share_api.service;

import io.github.ruinakayama.learning_share_api.dto.log.CreateLogRequest;
import io.github.ruinakayama.learning_share_api.dto.log.CreateLogResponse;

/*
「LearningLogService を名乗るなら、create(userId, req) を持ってて、
それを呼んだら CreateLogResponse を返せるようにしてね」
っていう宣言的なイメージだよ
*/

public interface LearningLogService {
  CreateLogResponse create(Long userId, CreateLogRequest req);

  CreateLogResponse getByShareToken(String token);
}
