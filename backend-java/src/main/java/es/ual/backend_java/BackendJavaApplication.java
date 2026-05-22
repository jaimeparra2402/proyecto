package es.ual.backend_java;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class BackendJavaApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendJavaApplication.class, args);
    }
}