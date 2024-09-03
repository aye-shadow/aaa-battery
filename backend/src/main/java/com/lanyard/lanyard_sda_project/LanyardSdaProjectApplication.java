package com.lanyard.lanyard_sda_project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class LanyardSdaProjectApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.load();
		System.setProperty("JDBC_DATABASE_URL", dotenv.get("JDBC_DATABASE_URL"));
		System.setProperty("JDBC_DATABASE_USERNAME", dotenv.get("JDBC_DATABASE_USERNAME"));
		System.setProperty("JDBC_DATABASE_PASSWORD", dotenv.get("JDBC_DATABASE_PASSWORD"));
		SpringApplication.run(LanyardSdaProjectApplication.class, args);
	}

}
