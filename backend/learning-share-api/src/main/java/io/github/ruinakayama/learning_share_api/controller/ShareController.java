package io.github.ruinakayama.learning_share_api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.github.ruinakayama.learning_share_api.dto.log.CreateLogResponse;
import io.github.ruinakayama.learning_share_api.service.LearningLogService;

@RestController
@RequestMapping("/api/share")
public class ShareController {

  private final LearningLogService learningLogService;

  public ShareController(LearningLogService learningLogService) {
    this.learningLogService = learningLogService;
  }

  @GetMapping("/{token}")
  public CreateLogResponse get(@PathVariable String token) {
    return learningLogService.getByShareToken(token);
  }
}
