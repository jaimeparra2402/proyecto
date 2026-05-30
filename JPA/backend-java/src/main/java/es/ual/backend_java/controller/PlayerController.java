package es.ual.backend_java.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

import es.ual.backend_java.model.Comment;
import es.ual.backend_java.model.Player;
import es.ual.backend_java.repository.PlayerRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PlayerController {

    @Autowired
    private PlayerRepository playerRepository;

    @Value("${api.football.key}")
    private String apiFootballKey;

    @Value("${gemini.api.key:mock-key-for-testing}")
    private String geminiApiKey;

    @GetMapping("/players")
    public ResponseEntity<Map<String, Object>> obtenerTodos(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String team,
            @RequestParam(required = false) String desdeFecha) {

        try {
            List<Player> players = playerRepository.findAll();

            if (name != null && !name.isBlank()) {
                String nameLower = name.toLowerCase();
                players = players.stream()
                        .filter(p -> p.getName() != null && p.getName().toLowerCase().contains(nameLower))
                        .collect(java.util.stream.Collectors.toList());
            }

            if (team != null && !team.isBlank()) {
                String teamLower = team.toLowerCase();
                players = players.stream()
                        .filter(p -> (p.getTeam() != null && p.getTeam().toLowerCase().contains(teamLower))
                                  || (p.getLeague() != null && p.getLeague().toLowerCase().contains(teamLower)))
                        .collect(java.util.stream.Collectors.toList());
            }

            if (desdeFecha != null && !desdeFecha.isBlank()) {
                try {
                    LocalDateTime desde = LocalDateTime.parse(desdeFecha + "T00:00:00");
                    players = players.stream()
                            .filter(p -> p.getCreatedAt() != null && !p.getCreatedAt().isBefore(desde))
                            .collect(java.util.stream.Collectors.toList());
                } catch (Exception e) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("status", "fail");
                    response.put("message", "Formato de fecha inválido. Use YYYY-MM-DD");
                    return ResponseEntity.badRequest().body(response);
                }
            }

            players.sort((a, b) -> {
                if (a.getCreatedAt() == null || b.getCreatedAt() == null) return 0;
                return b.getCreatedAt().compareTo(a.getCreatedAt());
            });

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("results", players.size());
            response.put("filtros", Map.of(
                "name", name != null ? name : "",
                "team", team != null ? team : "",
                "desdeFecha", desdeFecha != null ? desdeFecha : ""
            ));
            response.put("data", Map.of("players", players));
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Error al obtener los jugadores: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/players")
    public ResponseEntity<Map<String, Object>> crearJugador(@RequestBody Player player) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (player.getName() == null || player.getName().isBlank()) {
                response.put("status", "fail");
                response.put("message", "El nombre del jugador es obligatorio");
                return ResponseEntity.badRequest().body(response);
            }
            if (player.getTeam() == null || player.getTeam().isBlank()) {
                response.put("status", "fail");
                response.put("message", "El equipo es obligatorio");
                return ResponseEntity.badRequest().body(response);
            }
            if (player.getLeague() == null || player.getLeague().isBlank()) {
                response.put("status", "fail");
                response.put("message", "La liga es obligatoria");
                return ResponseEntity.badRequest().body(response);
            }
            if (player.getPosition() == null || player.getPosition().isBlank()) {
                response.put("status", "fail");
                response.put("message", "La posición es obligatoria");
                return ResponseEntity.badRequest().body(response);
            }

            Player savedPlayer = playerRepository.save(player);
            response.put("status", "success");
            response.put("message", "Jugador creado correctamente");
            response.put("data", Map.of("player", savedPlayer));
            return new ResponseEntity<>(response, HttpStatus.CREATED);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al crear el jugador: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/players/{id}")
    public ResponseEntity<Map<String, Object>> obtenerPorId(@PathVariable String id) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (id == null || id.isBlank()) {
                response.put("status", "fail");
                response.put("message", "El ID es obligatorio");
                return ResponseEntity.badRequest().body(response);
            }

            Player player = playerRepository.findById(id).orElse(null);
            if (player == null) {
                response.put("status", "fail");
                response.put("message", "No se encontró ningún jugador con el ID: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            response.put("status", "success");
            response.put("data", Map.of("player", player));
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al obtener el jugador: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping("/players/{id}")
    public ResponseEntity<Map<String, Object>> editarJugador(@PathVariable String id, @RequestBody Player playerDatos) {
        Map<String, Object> response = new HashMap<>();
        try {
            Player existing = playerRepository.findById(id).orElse(null);
            if (existing == null) {
                response.put("status", "fail");
                response.put("message", "No se encontró ningún jugador con el ID: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            existing.setName(playerDatos.getName());
            existing.setTeam(playerDatos.getTeam());
            existing.setLeague(playerDatos.getLeague());
            existing.setPosition(playerDatos.getPosition());
            existing.setImageUrl(playerDatos.getImageUrl());
            existing.setStats(playerDatos.getStats());
            Player updatedPlayer = playerRepository.save(existing);

            response.put("status", "success");
            response.put("message", "Jugador actualizado correctamente");
            response.put("data", Map.of("player", updatedPlayer));
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al actualizar el jugador: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/players/{id}")
    public ResponseEntity<Map<String, Object>> eliminarJugador(@PathVariable String id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Player player = playerRepository.findById(id).orElse(null);
            if (player == null) {
                response.put("status", "fail");
                response.put("message", "No se encontró ningún jugador con el ID: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            playerRepository.deleteById(id);
            response.put("status", "success");
            response.put("message", "Jugador '" + player.getName() + "' eliminado correctamente");
            response.put("data", null);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al eliminar el jugador: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/players/{id}/comments")
    public ResponseEntity<Map<String, Object>> addComment(@PathVariable String id, @RequestBody Comment comment) {
        Map<String, Object> response = new HashMap<>();
        try {
            Player player = playerRepository.findById(id).orElse(null);
            if (player == null) {
                response.put("status", "fail");
                response.put("message", "No se encontró ningún jugador con el ID: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            if (comment.getText() == null || comment.getText().isBlank()) {
                response.put("status", "fail");
                response.put("message", "El texto del comentario es obligatorio");
                return ResponseEntity.badRequest().body(response);
            }

            if (comment.getRating() == null || comment.getRating() < 0 || comment.getRating() > 5) {
                response.put("status", "fail");
                response.put("message", "El rating debe estar entre 0 y 5");
                return ResponseEntity.badRequest().body(response);
            }

            if (comment.getLatitude() == null || comment.getLongitude() == null) {
                response.put("status", "fail");
                response.put("message", "La latitud y longitud son obligatorias");
                return ResponseEntity.badRequest().body(response);
            }

            if (comment.getAuthor() == null || comment.getAuthor().isBlank()) {
                comment.setAuthor("Anónimo");
            }

            comment.setPlayerId(id);
            comment.setCreatedAt(LocalDateTime.now());
            player.getComments().add(comment);
            playerRepository.save(player);

            response.put("status", "success");
            response.put("message", "Comentario añadido correctamente al jugador '" + player.getName() + "'");
            response.put("data", comment);
            return new ResponseEntity<>(response, HttpStatus.CREATED);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al añadir el comentario: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/players/{id}/comments")
    public ResponseEntity<Map<String, Object>> getComments(@PathVariable String id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Player player = playerRepository.findById(id).orElse(null);
            if (player == null) {
                response.put("status", "fail");
                response.put("message", "No se encontró ningún jugador con el ID: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            response.put("status", "success");
            response.put("results", player.getComments().size());
            response.put("message", "Comentarios del jugador '" + player.getName() + "'");
            response.put("data", player.getComments());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al obtener los comentarios: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/players/{id}/comments/{commentId}")
    public ResponseEntity<Map<String, Object>> deleteComment(@PathVariable String id, @PathVariable String commentId) {
        Map<String, Object> response = new HashMap<>();
        try {
            Player player = playerRepository.findById(id).orElse(null);
            if (player == null) {
                response.put("status", "fail");
                response.put("message", "No se encontró ningún jugador con el ID: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            boolean removed = player.getComments().removeIf(c -> c.getId().equals(commentId));
            if (!removed) {
                response.put("status", "fail");
                response.put("message", "No se encontró ningún comentario con el ID: " + commentId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            playerRepository.save(player);
            response.put("status", "success");
            response.put("message", "Comentario eliminado correctamente");
            response.put("data", null);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al eliminar el comentario: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @SuppressWarnings("unchecked")
    @GetMapping("/external/search-player")
    public ResponseEntity<Map<String, Object>> buscarJugadorExterno(
            @RequestParam("search") String search,
            @RequestParam(value = "league", required = false) String league,
            @RequestParam(value = "season", required = false) String season) {

        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> resultadoFinal = new ArrayList<>();

        if (search == null || search.trim().isEmpty()) {
            response.put("status", "fail");
            response.put("message", "El parámetro 'search' es obligatorio");
            return ResponseEntity.badRequest().body(response);
        }

        if (search.trim().length() < 3) {
            response.put("status", "fail");
            response.put("message", "El término de búsqueda debe tener al menos 3 caracteres");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            String currentSeason = (season != null && !season.trim().isEmpty()) ? season : "2025";
            StringBuilder urlBuilder = new StringBuilder("https://v3.football.api-sports.io/players?search=" + search.trim() + "&season=" + currentSeason);

            if (league != null && !league.trim().isEmpty()) {
                urlBuilder.append("&league=").append(league);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.set("x-apisports-key", apiFootballKey.trim());

            HttpEntity<String> entity = new HttpEntity<>(headers);
            RestTemplate restTemplate = new RestTemplate();

            ResponseEntity<Map> responseEntity = restTemplate.exchange(
                    urlBuilder.toString(), HttpMethod.GET, entity, Map.class);

            if (responseEntity.getStatusCode().is2xxSuccessful() && responseEntity.getBody() != null) {
                Map<String, Object> body = responseEntity.getBody();

                Object errorsObj = body.get("errors");
                if (errorsObj instanceof Map && !((Map<?, ?>) errorsObj).isEmpty()) {
                    response.put("status", "fail");
                    response.put("message", "Error en la API externa de fútbol");
                    response.put("errors", errorsObj);
                    return ResponseEntity.badRequest().body(response);
                }

                List<Map<String, Object>> responseList = (List<Map<String, Object>>) body.get("response");

                if (responseList == null || responseList.isEmpty()) {
                    response.put("status", "success");
                    response.put("results", 0);
                    response.put("message", "No se encontraron jugadores con el término: " + search);
                    response.put("data", new ArrayList<>());
                    return ResponseEntity.ok(response);
                }

                for (Map<String, Object> item : responseList) {
                    Map<String, Object> playerNode = (Map<String, Object>) item.get("player");
                    List<Map<String, Object>> statisticsList = (List<Map<String, Object>>) item.get("statistics");

                    if (playerNode != null) {
                        Map<String, Object> jugadorMapeado = new HashMap<>();
                        jugadorMapeado.put("name", playerNode.get("firstname") + " " + playerNode.get("lastname"));
                        jugadorMapeado.put("team", "Desconocido");
                        jugadorMapeado.put("league", "Desconocida");
                        jugadorMapeado.put("position", "Desconocida");
                        jugadorMapeado.put("imageUrl", playerNode.get("photo") != null
                                ? playerNode.get("photo")
                                : "https://via.placeholder.com/150");

                        Map<String, Object> statsFinales = new HashMap<>();
                        statsFinales.put("goals", 0);
                        statsFinales.put("assists", 0);
                        statsFinales.put("matchesPlayed", 0);

                        if (statisticsList != null && !statisticsList.isEmpty()) {
                            Map<String, Object> statsNode = statisticsList.get(0);

                            Map<String, Object> teamNode = (Map<String, Object>) statsNode.get("team");
                            if (teamNode != null && teamNode.get("name") != null) {
                                jugadorMapeado.put("team", teamNode.get("name"));
                            }

                            Map<String, Object> leagueNode = (Map<String, Object>) statsNode.get("league");
                            if (leagueNode != null && leagueNode.get("name") != null) {
                                jugadorMapeado.put("league", leagueNode.get("name"));
                            }

                            Map<String, Object> gamesNode = (Map<String, Object>) statsNode.get("games");
                            if (gamesNode != null) {
                                if (gamesNode.get("position") != null) {
                                    jugadorMapeado.put("position", gamesNode.get("position"));
                                }
                                if (gamesNode.get("appearences") != null) {
                                    statsFinales.put("matchesPlayed", gamesNode.get("appearences"));
                                }
                            }

                            Map<String, Object> goalsNode = (Map<String, Object>) statsNode.get("goals");
                            if (goalsNode != null) {
                                if (goalsNode.get("total") != null) {
                                    statsFinales.put("goals", goalsNode.get("total"));
                                }
                                if (goalsNode.get("assists") != null) {
                                    statsFinales.put("assists", goalsNode.get("assists"));
                                }
                            }
                        }

                        jugadorMapeado.put("stats", statsFinales);
                        resultadoFinal.add(jugadorMapeado);
                    }
                }
            }

            response.put("status", "success");
            response.put("results", resultadoFinal.size());
            response.put("message", "Se encontraron " + resultadoFinal.size() + " jugadores para: " + search);
            response.put("data", resultadoFinal);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al conectar con la API externa: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/external/import")
    public ResponseEntity<Map<String, Object>> importarJugadorExterno(@RequestBody Player player) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (player.getName() == null || player.getName().isBlank()) {
                response.put("status", "fail");
                response.put("message", "El nombre del jugador es obligatorio para importar");
                return ResponseEntity.badRequest().body(response);
            }

            Player savedPlayer = playerRepository.save(player);
            response.put("status", "success");
            response.put("message", "Jugador '" + savedPlayer.getName() + "' importado correctamente");
            response.put("data", Map.of("player", savedPlayer));
            return new ResponseEntity<>(response, HttpStatus.CREATED);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al importar el jugador: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @SuppressWarnings("unchecked")
    @GetMapping("/external/equipo-ideal")
    public ResponseEntity<Map<String, Object>> generarEquipoIdeal() {
        Map<String, Object> respuestaFinal = new HashMap<>();

        try {
            List<Player> localPlayers = playerRepository.findAll();

            if (localPlayers.isEmpty()) {
                respuestaFinal.put("status", "fail");
                respuestaFinal.put("message", "No hay jugadores en la base de datos");
                return ResponseEntity.badRequest().body(respuestaFinal);
            }

            if (localPlayers.size() < 11) {
                respuestaFinal.put("status", "fail");
                respuestaFinal.put("message", "Necesitas al menos 11 jugadores. Actualmente tienes " + localPlayers.size() + ".");
                return ResponseEntity.badRequest().body(respuestaFinal);
            }

            List<Player> jugadoresParaIA = localPlayers.subList(0, Math.min(20, localPlayers.size()));

            StringBuilder playersListForAI = new StringBuilder();
            for (Player p : jugadoresParaIA) {
                playersListForAI.append(String.format(
                        "- Nombre: %s, Posicion: %s, Goles: %d, Asistencias: %d\n",
                        p.getName(), p.getPosition(),
                        p.getStats().getGoals(), p.getStats().getAssists()));
            }

            String prompt = "Eres un director tecnico de futbol. " +
                    "Elige el equipo ideal de 11 jugadores con formacion 4-3-3 o 4-4-2.\n\n" +
                    playersListForAI.toString() +
                    "\n\nDevuelve SOLO un JSON sin texto adicional ni markdown:\n" +
                    "{\"formacion\":\"4-3-3\",\"jugadores\":[{\"nombre\":\"...\",\"posicion\":\"...\"}],\"explicacion\":\"...\"}";

            Map<String, Object> part = new HashMap<>();
            part.put("text", prompt);

            Map<String, Object> content = new HashMap<>();
            content.put("parts", List.of(part));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", List.of(content));

            String geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + geminiApiKey;

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> geminiResponse = restTemplate.postForEntity(geminiUrl, requestBody, Map.class);

            if (!geminiResponse.getStatusCode().is2xxSuccessful() || geminiResponse.getBody() == null) {
                respuestaFinal.put("status", "error");
                respuestaFinal.put("message", "La IA no respondió correctamente, inténtalo de nuevo");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuestaFinal);
            }

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) geminiResponse.getBody().get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                respuestaFinal.put("status", "error");
                respuestaFinal.put("message", "La IA no generó ninguna respuesta");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuestaFinal);
            }

            Map<String, Object> candidateContent = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) candidateContent.get("parts");
            String aiText = (String) parts.get(0).get("text");

            String cleanJson = aiText.replaceAll("```json", "").replaceAll("```", "").trim();

            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> equipoIdeal = objectMapper.readValue(cleanJson, Map.class);

            respuestaFinal.put("status", "success");
            respuestaFinal.put("message", "Equipo ideal generado con " + jugadoresParaIA.size() + " jugadores analizados");
            respuestaFinal.put("data", equipoIdeal);
            return ResponseEntity.ok(respuestaFinal);

        } catch (Exception e) {
            respuestaFinal.put("status", "error");
            respuestaFinal.put("message", "Error al generar el equipo ideal: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuestaFinal);
        }
    }
}