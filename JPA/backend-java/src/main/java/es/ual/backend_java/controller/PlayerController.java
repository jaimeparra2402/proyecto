package es.ual.backend_java.controller;
import es.ual.backend_java.client.CommentClient;
import java.util.Map;
import es.ual.backend_java.model.Player;
import es.ual.backend_java.repository.PlayerRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/players")
@CrossOrigin(origins = "*")
public class PlayerController {

    private final PlayerRepository playerRepository;
    private final CommentClient commentClient;


    public PlayerController(PlayerRepository playerRepository, CommentClient commentClient) {
        this.playerRepository = playerRepository;
        this.commentClient = commentClient;
    }

    @GetMapping
    public ResponseEntity<List<Player>> getAll() {
        return ResponseEntity.ok(playerRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Player> getById(@PathVariable Long id) {
        Optional<Player> player = playerRepository.findById(id);
        return player.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search/name")
    public ResponseEntity<List<Player>> searchByName(@RequestParam String name) {
        return ResponseEntity.ok(playerRepository.findByNameContainingIgnoreCase(name));
    }

    @GetMapping("/search/team")
    public ResponseEntity<List<Player>> searchByTeam(@RequestParam String team) {
        return ResponseEntity.ok(playerRepository.findByTeamContainingIgnoreCaseOrLeagueContainingIgnoreCase(team, team));
    }

    @GetMapping("/search/date")
    public ResponseEntity<List<Player>> searchByDate(@RequestParam String from, @RequestParam String to) {
        LocalDate fromDate = LocalDate.parse(from);
        LocalDate toDate = LocalDate.parse(to);
        return ResponseEntity.ok(playerRepository.findByRegistrationDateBetween(fromDate, toDate));
    }

    @PostMapping
    public ResponseEntity<Player> create(@RequestBody Player player) {
        Player saved = playerRepository.save(player);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Player> update(@PathVariable Long id, @RequestBody Player player) {
        if (!playerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        player.setId(id);
        return ResponseEntity.ok(playerRepository.save(player));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!playerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        playerRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<Map<String, Object>>> getPlayerComments(@PathVariable Long id) {
        if (!playerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(commentClient.getCommentsByPlayer(id));
    }
}