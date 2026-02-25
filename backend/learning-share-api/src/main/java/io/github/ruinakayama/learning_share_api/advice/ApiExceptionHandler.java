package io.github.ruinakayama.learning_share_api.advice;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import io.github.ruinakayama.learning_share_api.exception.UnauthorizedException;

// Controllerのエラーに関してこのクラスでエラーハンドリングを行う
@RestControllerAdvice
public class ApiExceptionHandler {

  // error: 種別（機械用） / message: 人が読む用 / details: 追加情報（任意）
  public record ErrorResponse(String error, String message, Map<String, Object> details) {
    public static ErrorResponse simple(String error, String message) {
      return new ErrorResponse(error, message, null);
    }
  }

  @ExceptionHandler(UnauthorizedException.class)
  public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException e) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        .body(ErrorResponse.simple("UNAUTHORIZED", e.getMessage()));
  }

  // ✅ バリデーションエラー → 400（どのフィールドがダメか返す）
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException e) {

    Map<String, Object> details = new LinkedHashMap<>();
    Map<String, String> fieldErrors = new LinkedHashMap<>();

    e.getBindingResult().getFieldErrors().forEach(err -> {
      // 同じフィールドで複数エラー出ることがあるので、後勝ち/先勝ちどっちでもOK。ここは先勝ちにしてる
      fieldErrors.putIfAbsent(err.getField(), err.getDefaultMessage());
    });

    details.put("fields", fieldErrors);

    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(new ErrorResponse("BAD_REQUEST", "validation failed", details));
  }

  // ✅ DB制約違反 → 400（FK/UNIQUE/NOT NULL/チェック制約など）
  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<ErrorResponse> handleDataIntegrity(DataIntegrityViolationException e) {
    // セキュリティ的に詳細は隠してOK（内部のSQLや制約名を出しすぎない）
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(ErrorResponse.simple("BAD_REQUEST", "db constraint violation"));
  }
}
