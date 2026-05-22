package es.ual.backend_java.repository;

import es.ual.backend_java.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface PlayerRepository extends JpaRepository<Player, Long> {

    List<Player> findByNameContainingIgnoreCase(String name);
    List<Player> findByTeamContainingIgnoreCaseOrLeagueContainingIgnoreCase(String team, String league);
    List<Player> findByRegistrationDateBetween(LocalDate from, LocalDate to);
}