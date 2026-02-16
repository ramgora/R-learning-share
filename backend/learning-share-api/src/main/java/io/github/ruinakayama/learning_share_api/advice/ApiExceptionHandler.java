package io.github.ruinakayama.learning_share_api.advice;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import io.github.ruinakayama.learning_share_api.exception.UnauthorizedException;

/*
 * @RestControllerAdvice
 * 
 * このアノテーションがつくことにより、アプリ全体のControllerに対して例外が発生した際に、ここでまとめてキャッチすることができる
 * つまり、全Controller共通の例外処理場所になる。
 * Restがつくと返す内容がJson形式で返してくれる
 */
@RestControllerAdvice
public class ApiExceptionHandler {

  public record ErrorResponse(String error, String message) {
  }

  /*
   * @ExceptionHandler(UnauthorizedException.class)
   * UnauthorizedExceptionが発生したらこのメソッドで処理するという指定をしている
   * 
   */

  /*
   * ResponseEntity の“中身”は何でできてる？
   * 
   * ・Status（ステータスコード）
   * 例：200 / 400 / 401 / 404 …
   * ・Headers（ヘッダー）
   * 例：Content-Type, Set-Cookie など
   * ・Body（ボディ）
   * 実際に返すデータ（JSONになる部分）
   * ResponseEntity<T> の T は ボディの型です
   */
  @ExceptionHandler(UnauthorizedException.class)
  public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException e) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        .body(new ErrorResponse("UNAUTHORIZED", e.getMessage()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException e) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(new ErrorResponse("BAD_REQUEST", "validation error"));
  }

}
