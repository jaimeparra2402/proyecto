package es.ual.backend_java.repository;

import es.ual.backend_java.model.Player;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

public interface PlayerRepository extends MongoRepository<Player, String> {
	Optional<Player> findById(String id);
}