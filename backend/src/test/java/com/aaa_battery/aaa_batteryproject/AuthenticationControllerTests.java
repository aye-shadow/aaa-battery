package com.aaa_battery.aaa_batteryproject;

import com.aaa_battery.aaa_batteryproject.authentication.controller.AuthenticationController;
import com.aaa_battery.aaa_batteryproject.authentication.responses.LoginResponse;
import com.aaa_battery.aaa_batteryproject.authentication.service.AuthenticationService;
import com.aaa_battery.aaa_batteryproject.security.jwt.services.JwtService;
import com.aaa_battery.aaa_batteryproject.user.dtos.LoginUserDto;
import com.aaa_battery.aaa_batteryproject.user.dtos.RegisterUserDto;
import com.aaa_battery.aaa_batteryproject.user.model.UserEntity;
import com.aaa_battery.aaa_batteryproject.user.roles.Role;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthenticationControllerTests {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private AuthenticationService authenticationService;

	@MockBean
	private JwtService jwtService;

	@Test
	void testSignup() throws Exception {
		UserEntity mockUser = new UserEntity();
		mockUser.setId((int) 1L);
		mockUser.setUsername("testuser");

		Mockito.when(authenticationService.signup(any(RegisterUserDto.class))).thenReturn(mockUser);

		String requestBody = """
				{
					"username": "testuser",
					"password": "password123",
					"email": "testuser@example.com"
				}
				""";

		mockMvc.perform(post("/api/auth/signup")
						.contentType(MediaType.APPLICATION_JSON)
						.content(requestBody))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.username").value("testuser"));
	}

	@Test
	void testLoginSuccess() throws Exception {
		UserEntity mockUser = new UserEntity();
		mockUser.setId((int) 1L);
		mockUser.setUsername("testuser");
		mockUser.setRole(Role.BORROWER);

		Mockito.when(authenticationService.authenticate(any(LoginUserDto.class))).thenReturn(mockUser);
		Mockito.when(jwtService.generateToken(mockUser)).thenReturn("mock-jwt-token");
		Mockito.when(jwtService.getExpirationTime()).thenReturn(3600L);

		String requestBody = """
				{
					"username": "testuser",
					"password": "password123",
					"role": "USER"
				}
				""";

		mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(requestBody))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.token").value("mock-jwt-token"))
				.andExpect(jsonPath("$.expiresIn").value(3600))
				.andExpect(jsonPath("$.message").value("Login successful"))
				.andExpect(cookie().value("jwt", "mock-jwt-token"));
	}

	@Test
	void testLoginInvalidCredentials() throws Exception {
		Mockito.when(authenticationService.authenticate(any(LoginUserDto.class))).thenReturn(null);

		String requestBody = """
				{
					"username": "invaliduser",
					"password": "wrongpassword",
					"role": "USER"
				}
				""";

		mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(requestBody))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.message").value("Invalid credentials. Authentication failed."));
	}

	@Test
	void testLogout() throws Exception {
		mockMvc.perform(post("/api/auth/logout")
						.cookie(new jakarta.servlet.http.Cookie("jwt", "mock-jwt-token")))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").value("User logged out successfully"))
				.andExpect(cookie().value("jwt", ""));
	}

	@Test
	void testLogoutNoCookie() throws Exception {
		mockMvc.perform(post("/api/auth/logout"))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$").value("No user logged in"));
	}
}