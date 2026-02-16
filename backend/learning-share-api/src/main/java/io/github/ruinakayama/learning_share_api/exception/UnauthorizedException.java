package io.github.ruinakayama.learning_share_api.exception;

public class UnauthorizedException extends RuntimeException {
  // コンストラクタ
  // superは親クラスのコンストラクタを呼ぶ -> ここでいう親クラスはRuntimeExceptionになる
  public UnauthorizedException(String message) {
    super(message);
  }
}
