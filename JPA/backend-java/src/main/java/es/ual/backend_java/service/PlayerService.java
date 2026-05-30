package es.ual.backend_java.service;

import es.ual.backend_java.model.Player;
import es.ual.backend_java.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.List;

@Service
public class PlayerService {

    private final PlayerRepository playerRepository;
    private final RestClient restClient;

    @Value("${football.api.key:4f63c05c501e3759ae6fd3a9bcda27ea}")
    private String footballApiKey;

    @Value("${gemini.api.key:AIzaSyCykidHMQE5teRSiykyrS-kxuFZf9YjvmE}")
    private String geminiApiKey;

    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
        this.restClient = RestClient.builder().build();
    }

    public String searchExternalPlayers(String search, String league, String season) {
        String currentSeason = (season != null) ? season : "2025";
        String url = "https://v3.football.api-sports.io/players?search=" + search + "&season=" + currentSeason;
        if (league != null) {
            url += "&league=" + league;
        }

        return restClient.get()
                .uri(url)
                .header("x-rapidapi-key", footballApiKey)
                .header("x-rapidapi-host", "v3.football.api-sports.io")
                .retrieve()
                .body(String.class);
    }

    public String generateIdealTeam() {
        List<Player> localPlayers = playerRepository.findAll();
        if (localPlayers.size() < 11) {
            throw new IllegalArgumentException("Necesitas tener al menos 11 jugadores en tu base de datos local.");
        }

        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("Eres un director técnico de fútbol profesional de élite mundial. ");
        promptBuilder.append("A continuación te proporciono la lista de jugadores disponibles: ");
        
        for (Player p : localPlayers) {
            promptBuilder.append(String.format("- Nombre: %s, Equipo: %s, Posicion: %s, Goles: %d. ", 
                p.getName(), p.getTeam(), p.getPosition(), p.getStats().getGoals()));
        }

        promptBuilder.append("Por favor, analiza sus métricas y arma el Equipo Ideal definitivo de 11 jugadores en formato JSON: ");
        promptBuilder.append("{ \"formacion\": \"Ej: 4-3-3\", \"once_ideal\": [ { \"nombre\": \"...\", \"posicion\": \"...\", \"motivo\": \"...\" } ], \"analisis_tactico\": \"...\" }");

        String geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;
        String requestBody = "{\"contents\": [{\"parts\": [{\"text\": \"" + promptBuilder.toString() + "\"}]}], \"generationConfig\": {\"responseMimeType\": \"application/json\"}}";

        return restClient.post()
                .uri(geminiUrl)
                .header("Content-Type", "application/json")
                .body(requestBody)
                .retrieve()
                .body(String.class);
    }
}