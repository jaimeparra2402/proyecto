package es.ual.comments_service;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
        		.info(new Info()
                        .title("Proyecto Comun")
                        .version("1.0")
                        .description("Documentación interactiva de la API para la gestión de jugadores y usuarios."));

    }
}