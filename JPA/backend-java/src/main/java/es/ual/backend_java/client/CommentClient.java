package es.ual.backend_java.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@FeignClient(name = "comments-service")
public interface CommentClient {

    @GetMapping("/api/comments/player/{playerId}")
    List<Map<String, Object>> obtenerComentariosPorJugador(@PathVariable("playerId") String playerId);

    @PostMapping("/api/comments")
    Map<String, Object> crearComentario(@RequestBody Map<String, Object> comentario); // <-- Faltaba el @RequestBody

    @DeleteMapping("/api/comments/{commentId}")
    void eliminarComentario(@PathVariable("commentId") String commentId);
}