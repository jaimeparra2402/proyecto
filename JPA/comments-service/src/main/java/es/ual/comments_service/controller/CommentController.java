package es.ual.comments_service.controller;

import es.ual.comments_service.model.Comment;
import es.ual.comments_service.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    @GetMapping("/player/{playerId}/comments")
    public List<Comment> obtenerPorJugador(@PathVariable String playerId) {
        return commentRepository.findByPlayer(playerId);
    }

    @PostMapping("/player/{playerId}/comments")
    public Comment crearComentario(@PathVariable("playerId") String playerId, @RequestBody Comment comentario) {
        comentario.setPlayer(playerId);
        return commentRepository.save(comentario);
    }
    @DeleteMapping("/player/{playerId}/comment/{commentId}")
    public void eliminarComentario(@PathVariable String playerId, @PathVariable String commentId) {
        commentRepository.deleteById(commentId);
    }
}