package io.github.ruinakayama.learning_share_api.auth;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class DevAuthController {

  @PostMapping("/dev-login")
  public ResponseEntity<?> devLogin(HttpSession session) {
    session.setAttribute("USER_ID", 1L);
    return ResponseEntity.ok(Map.of("message", "dev login ok", "userId", 1));
  }

  @GetMapping("/me")
  public ResponseEntity<?> me(HttpSession session) {
    Long userId = (Long) session.getAttribute("USER_ID");
    if (userId == null)
      return ResponseEntity.status(401).body(Map.of("message", "unauthorized"));
    return ResponseEntity.ok(Map.of("userId", userId));
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(HttpSession session) {
    session.invalidate();
    return ResponseEntity.ok(Map.of("message", "logout ok"));
  }
}
