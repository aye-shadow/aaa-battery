package com.aaa_battery.aaa_batteryproject.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import com.aaa_battery.aaa_batteryproject.security.jwt.config.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfiguration(
        JwtAuthenticationFilter jwtAuthenticationFilter,
        AuthenticationProvider authenticationProvider
    ) {
        this.authenticationProvider = authenticationProvider;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowedOrigins(List.of(
                    "http://localhost:8080",
                    "http://localhost:3000",
                    "https://aaa-battery.vercel.app",
                    "https://aaa-battery-spring-backend-894699792c03.herokuapp.com"
                )); 
                config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE")); // Ensure no trailing comma
                config.setAllowedHeaders(List.of("*")); // Ensure no trailing comma
                config.setAllowCredentials(true); // Allows cookies
                return config;
            }))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/actuator/mappings", "/api/auth/**").permitAll()
                .requestMatchers("/api/librarian/**", "/api/items/librarian/**", "/api/request/librarian/**").hasRole("LIBRARIAN")
                .requestMatchers("/api/items/borrower/**", "/api/request/borrower/**", "/api/subscribe/borrower/**").hasRole("BORROWER")
                .requestMatchers("/api/user/**", "/api/items/users/**").authenticated()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}