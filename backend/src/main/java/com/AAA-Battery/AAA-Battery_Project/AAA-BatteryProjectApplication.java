package com.lanyard.lanyard_sda_project;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
@ComponentScan(basePackages = "com.lanyard.lanyard_sda_project")
@EntityScan(basePackages = "com.lanyard.lanyard_sda_project.testclass.model")
@EnableJpaRepositories(basePackages = "com.lanyard.lanyard_sda_project.testclass.repository")
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