package es.ual.comments_service.repository;

import es.ual.comments_service.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPlayerId(Long playerId);
}