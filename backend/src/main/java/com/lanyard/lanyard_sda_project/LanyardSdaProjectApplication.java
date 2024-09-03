package com.lanyard.lanyard_sda_project;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class LanyardSdaProjectApplication {
    public static void main(String[] args) {
        SpringApplication.run(LanyardSdaProjectApplication.class, args);
    }

    @Bean
    public CommandLineRunner loadEnvVariables() {
        return args -> {
            String activeProfile = System.getProperty("spring.profiles.active", "default");
            if ("local".equals(activeProfile)) {
                Dotenv dotenv = Dotenv.load();
                System.setProperty("JDBC_DATABASE_URL", dotenv.get("JDBC_DATABASE_URL"));
                System.setProperty("JDBC_DATABASE_USERNAME", dotenv.get("JDBC_DATABASE_USERNAME"));
                System.setProperty("JDBC_DATABASE_PASSWORD", dotenv.get("JDBC_DATABASE_PASSWORD"));
            }
        };
    }
}