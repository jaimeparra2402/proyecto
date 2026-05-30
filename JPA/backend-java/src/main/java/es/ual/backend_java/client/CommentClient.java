package es.ual.backend_java.client;

import java.util.List;
import java.util.Map;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "comments-service", path = "/api/v1/comments")
public interface CommentClient {

    @PostMapping
    Map<String, Object> crearComentario(@RequestBody Map<String, Object> comment);

    @GetMapping("/player/{playerId}")
    List<Object> obtenerComentariosPorJugador(@PathVariable("playerId") String playerId);

    @DeleteMapping("/{id}")
    Map<String, Object> eliminarComentario(@PathVariable("id") String id);
}