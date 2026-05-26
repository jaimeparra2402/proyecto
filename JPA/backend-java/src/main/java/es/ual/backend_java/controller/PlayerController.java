package es.ual.backend_java.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
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

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.converter.BeanOutputConverter;

import es.ual.backend_java.client.CommentClient;
import es.ual.backend_java.dto.EquipoIdealResponseDTO;
import es.ual.backend_java.model.Player;
import es.ual.backend_java.repository.PlayerRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PlayerController {

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private CommentClient commentClient;

    @Autowired
    private ChatModel chatModel;

    @Value("${api.football.key}")
    private String apiFootballKey;

    @GetMapping("/players")
    public List<Player> obtenerTodos() {
        List<Player> players = playerRepository.findAll();
        for (Player p : players) {
            try {
                if (p.getId() != null) {
                    p.setComments(commentClient.obtenerComentariosPorJugador(p.getId()));
                } else {
                    p.setComments(new ArrayList<>());
                }
            } catch (Exception e) {
                p.setComments(new ArrayList<>()); 
            }
        }
        return players;
    }

    @PostMapping("/players")
    public Player crearJugador(@RequestBody Player player) {
        return playerRepository.save(player);
    }

    @GetMapping("/players/{id}")
    public Player obtenerPorId(@PathVariable String id) {
        Player player = playerRepository.findById(id).orElse(null);
        if (player != null) {
            try {
                player.setComments(commentClient.obtenerComentariosPorJugador(id));
            } catch (Exception e) {
                player.setComments(new ArrayList<>());
            }
        }
        return player;
    }

    @PutMapping("/players/{id}")
    public Player editarJugador(@PathVariable String id, @RequestBody Player playerDatos) {
        return playerRepository.findById(id).map(player -> {
            player.setName(playerDatos.getName());
            player.setTeam(playerDatos.getTeam());
            player.setLeague(playerDatos.getLeague());
            player.setPosition(playerDatos.getPosition());
            player.setImageUrl(playerDatos.getImageUrl());
            player.setStats(playerDatos.getStats());
            return playerRepository.save(player);
        }).orElse(null);
    }

    @DeleteMapping("/players/{id}")
    public void eliminarJugador(@PathVariable String id) {
        playerRepository.deleteById(id);
    }

    @SuppressWarnings("unchecked")
    @GetMapping("/external/search-player")
    public List<Map<String, Object>> buscarJugadorExterno(
            @RequestParam("search") String search,
            @RequestParam(value = "league", required = false) String league,
            @RequestParam(value = "season", required = false) String season) {
            
        List<Map<String, Object>> resultadoFinal = new ArrayList<>();
        
        if (search == null || search.trim().length() < 3) {
            return resultadoFinal; 
        }

        try {
            StringBuilder urlBuilder = new StringBuilder("https://v3.football.api-sports.io/players?search=" + search);
            
            if (league != null && !league.trim().isEmpty()) {
                urlBuilder.append("&league=").append(league);
            }
            if (season != null && !season.trim().isEmpty()) {
                urlBuilder.append("&season=").append(season);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.set("x-rapidapi-key", apiFootballKey.trim()); 
            headers.set("x-rapidapi-host", "v3.football.api-sports.io");

            HttpEntity<String> entity = new HttpEntity<>(headers);
            RestTemplate restTemplate = new RestTemplate();

            ResponseEntity<Map> response = restTemplate.exchange(urlBuilder.toString(), HttpMethod.GET, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                List<Map<String, Object>> responseList = (List<Map<String, Object>>) body.get("response");

                if (responseList != null) {
                    for (Map<String, Object> item : responseList) {
                        Map<String, Object> playerNode = (Map<String, Object>) item.get("player");
                        List<Map<String, Object>> statisticsList = (List<Map<String, Object>>) item.get("statistics");

                        if (playerNode != null) {
                            Map<String, Object> jugadorMapeado = new HashMap<>();
                            jugadorMapeado.put("externalId", playerNode.get("id"));
                            jugadorMapeado.put("name", playerNode.get("name"));
                            jugadorMapeado.put("imageUrl", playerNode.get("photo"));

                            if (statisticsList != null && !statisticsList.isEmpty()) {
                                Map<String, Object> statsNode = statisticsList.get(0);
                                
                                Map<String, Object> teamNode = (Map<String, Object>) statsNode.get("team");
                                if (teamNode != null) {
                                    jugadorMapeado.put("team", teamNode.get("name"));
                                }
                                
                                Map<String, Object> leagueNode = (Map<String, Object>) statsNode.get("league");
                                if (leagueNode != null) {
                                    jugadorMapeado.put("league", leagueNode.get("name"));
                                }
                                
                                Map<String, Object> gamesNode = (Map<String, Object>) statsNode.get("games");
                                if (gamesNode != null) {
                                    jugadorMapeado.put("position", gamesNode.get("position"));
                                }

                                Map<String, Object> goalsNode = (Map<String, Object>) statsNode.get("goals");
                                Map<String, Object> statsFinales = new HashMap<>();
                                if (goalsNode != null) {
                                    statsFinales.put("goals", goalsNode.get("total") != null ? goalsNode.get("total") : 0);
                                    statsFinales.put("assists", goalsNode.get("assists") != null ? goalsNode.get("assists") : 0);
                                } else {
                                    statsFinales.put("goals", 0);
                                    statsFinales.put("assists", 0);
                                }
                                statsFinales.put("matchesPlayed", gamesNode != null && gamesNode.get("appeances") != null ? gamesNode.get("appeances") : 0);
                                
                                jugadorMapeado.put("stats", statsFinales);
                            }
                            resultadoFinal.add(jugadorMapeado);
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error al conectar con API-Football: " + e.getMessage());
            e.printStackTrace(); 
        }

        return resultadoFinal;
    }

    @PostMapping("/external/import")
    public Player importarJugadorExterno(@RequestBody Player player) {
        return playerRepository.save(player);
    }

    @GetMapping("/external/equipo-ideal")
    public ResponseEntity<Map<String, Object>> generarEquipoIdeal() {
        Map<String, Object> respuestaFinal = new HashMap<>();

        try {
            List<Player> localPlayers = playerRepository.findAll();

            if (localPlayers.size() < 11) {
                respuestaFinal.put("status", "fail");
                respuestaFinal.put("message", "Necesitas tener al menos 11 jugadores en tu base de datos local para generar un equipo ideal. Actualmente tienes " + localPlayers.size() + ".");
                return ResponseEntity.badRequest().body(respuestaFinal);
            }

            StringBuilder playersListForAI = new StringBuilder();
            for (Player p : localPlayers) {
                playersListForAI.append(String.format("- Nombre: %s, Equipo: %s, Posición: %s, Goles: %d, Asistencias: %d, Partidos: %d\n",
                    p.getName(), p.getTeam(), p.getPosition(), p.getStats().getGoals(), p.getStats().getAssists(), p.getStats().getMatchesPlayed()));
            }

            BeanOutputConverter<EquipoIdealResponseDTO> outputConverter = 
                new BeanOutputConverter<>(EquipoIdealResponseDTO.class);

            String promptBase = """
              Eres un director técnico de fútbol profesional de élite mundial. 
              A continuación te proporciono la lista de jugadores disponibles en mi base de datos local con sus respectivas estadísticas:
              
              {lista_jugadores}
              
              Por favor, analiza sus métricas y posiciones para armar el "Equipo Ideal" definitivo de 11 jugadores utilizando una formación táctica lógica (por ejemplo, 4-3-3 o 4-4-2).
              
              Debes ceñirte de forma estricta al formato de salida solicitado.
              {formato_salida}
            """;

            Map<String, Object> modelOptions = new HashMap<>();
            modelOptions.put("lista_jugadores", playersListForAI.toString());
            modelOptions.put("formato_salida", outputConverter.getFormat());

            PromptTemplate promptTemplate = new PromptTemplate(promptBase);
            Prompt promptFinal = promptTemplate.create(modelOptions);
            
            ChatResponse aiResponse = chatModel.call(promptFinal);
            String aiTextResponse = aiResponse.getResult().getOutput().getText();

            EquipoIdealResponseDTO idealTeamResult = outputConverter.convert(aiTextResponse);

            respuestaFinal.put("status", "success");
            respuestaFinal.put("data", idealTeamResult);
            
            return ResponseEntity.ok(respuestaFinal);

        } catch (Exception e) {
            e.printStackTrace();
            respuestaFinal.put("status", "error");
            respuestaFinal.put("message", "Error al generar el equipo ideal con el LLM: " + e.getMessage());
            return ResponseEntity.status(500).body(respuestaFinal);
        }
    }
}