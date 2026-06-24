package io.github.ruinakayama.learning_share_api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.github.ruinakayama.learning_share_api.dto.log.CreateLogRequest;
import io.github.ruinakayama.learning_share_api.dto.log.CreateLogResponse;
import io.github.ruinakayama.learning_share_api.dto.log.LogDetailResponse;
import io.github.ruinakayama.learning_share_api.dto.log.LogSummaryResponse;
import io.github.ruinakayama.learning_share_api.dto.log.UpdateLogRequest;
import io.github.ruinakayama.learning_share_api.exception.UnauthorizedException;
import io.github.ruinakayama.learning_share_api.service.LearningLogService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/logs")
public class LearningLogController {

  private final LearningLogService learningLogService;

  // コンストラクタ Java では、コンストラクタは コンストラクタ名 = クラス名で判断する
  public LearningLogController(LearningLogService learningLogService) {
    this.learningLogService = learningLogService;
  }

  // RequestMapping でパスの指定をしているためPostMappingをつけるだけでOK

  // レスポンス全体（HTTPステータス + ボディ）**を返す箱。
  // その中身（ボディ）が CreateLogResponse 型ですよ、という意味。
  @PostMapping
  public ResponseEntity<CreateLogResponse> create(
      @Valid @RequestBody CreateLogRequest req,
      HttpSession session) {
    // セッションからUSER_IDを取得する
    Long userId = (Long) session.getAttribute("USER_ID");
    if (userId == null) {
      // Day5の例外変換で 401 にする
      throw new UnauthorizedException("login required");
    }
    CreateLogResponse res = learningLogService.create(userId, req);
    return ResponseEntity.status(201).body(res);
  }

  @GetMapping("/me")
  public ResponseEntity<List<LogSummaryResponse>> getMyLogs(HttpSession session) {

    Long userId = (Long) session.getAttribute("USER_ID");

    // USER_ID がない = 未ログインの場合401 を返す
    if (userId == null) {
      throw new UnauthorizedException("login required");
    }
    // Service に一覧取得処理を委譲する
    List<LogSummaryResponse> res = learningLogService.getMyLogs(userId);
    // 一覧取得成功なので 200 OK を返す
    return ResponseEntity.ok(res);
  }

  @GetMapping("/{id}")
  public ResponseEntity<LogDetailResponse> getLogDetail(HttpSession session, @PathVariable Long id) {
    Long userId = (Long) session.getAttribute("USER_ID");
    if (userId == null) {
      throw new UnauthorizedException("login required");
    }
    LogDetailResponse res = learningLogService.getLogDetail(userId, id);
    return ResponseEntity.ok(res);
  }

  // ログ更新処理
  @PatchMapping("/{id}")
  public ResponseEntity<CreateLogResponse> updateLogs(@PathVariable Long id,
      @Valid @RequestBody UpdateLogRequest req,
      HttpSession session) {
    Long userId = (Long) session.getAttribute("USER_ID");
    if (userId == null) {
      throw new UnauthorizedException("login required");
    }
    CreateLogResponse res = learningLogService.update(userId, id, req);
    return ResponseEntity.ok(res);
  }

  // 学習ログ削除処理
  @DeleteMapping("/{id}")
  public void deleteLog(@PathVariable Long id, HttpSession session) {
    Long userId = (Long) session.getAttribute("USER_ID");
    if (userId == null) {
      throw new UnauthorizedException("login required");
    }
    learningLogService.deleteLog(userId, id);
  }
}
