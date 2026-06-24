package io.github.ruinakayama.learning_share_api.dto.log;

import java.util.List;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateLogRequest(

    @NotBlank String title,

    @NotBlank String content,

    @NotNull @Min(0) Integer minutes,

    @NotNull Visibility visibility,

    List<String> tags

) {
}
