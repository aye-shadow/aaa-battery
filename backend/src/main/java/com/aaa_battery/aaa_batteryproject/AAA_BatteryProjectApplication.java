package com.aaa_battery.aaa_batteryproject;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
@ComponentScan(basePackages = "com.aaa_battery.aaa_batteryproject")
@EntityScan(basePackages = {
    "com.aaa_battery.aaa_batteryproject.user.model",
    "com.aaa_battery.aaa_batteryproject.borrows.model",
    "com.aaa_battery.aaa_batteryproject.subscription.model",
    "com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models",
    "com.aaa_battery.aaa_batteryproject.item.model",
    "com.aaa_battery.aaa_batteryproject.requests.model"

})
@EnableJpaRepositories(basePackages = {
    "com.aaa_battery.aaa_batteryproject.user.repositories",
    "com.aaa_battery.aaa_batteryproject.item.itemdescriptions.repository",
    "com.aaa_battery.aaa_batteryproject.item.repository",
    "com.aaa_battery.aaa_batteryproject.borrows.repository",
    "com.aaa_battery.aaa_batteryproject.requests.repository"
})
@EnableWebMvc
public class AAA_BatteryProjectApplication {
    public static void main(String[] args) {
        SpringApplication.run(AAA_BatteryProjectApplication.class, args);
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
                System.setProperty("JWT_SECRET_KEY", dotenv.get("JWT_SECRET_KEY"));
            }
        };
    }

    @RestController
    public class HomeResource {
        @GetMapping("/")
        public String home() {
            return "<h1>Welcome</h1>";
        }
    }
}