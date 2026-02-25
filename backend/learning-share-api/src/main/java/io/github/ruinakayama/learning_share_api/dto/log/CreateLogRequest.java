package io.github.ruinakayama.learning_share_api.dto.log;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.util.List;

/* 

　DTO（Data Transfer Object）＝注文票 / 伝票
・APIで受け取るデータ（Request DTO）
・APIで返すデータ（Response DTO）
・“画面から来る形”と“画面へ返す形”を固定して、事故を防ぐ
  → DBの形（Entity）をそのまま外に出さないためにも使う

*/

public record CreateLogRequest(
    @NotBlank @Size(max = 100) String title,

    @NotBlank String content,

    @NotNull @Positive // 0より大きい
    Integer minutes,

    List<String> tags,

    @NotNull Visibility visibility) {
}
