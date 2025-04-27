package com.aaa_battery.aaa_batteryproject.authentication.blackbox;

import com.aaa_battery.aaa_batteryproject.authentication.service.AuthenticationService;
import com.aaa_battery.aaa_batteryproject.security.jwt.services.JwtService;
import com.aaa_battery.aaa_batteryproject.user.dtos.LoginUserDto;
import com.aaa_battery.aaa_batteryproject.user.model.UserEntity;
import com.aaa_battery.aaa_batteryproject.user.roles.Role;
import com.aaa_battery.aaa_batteryproject.util.Credentials;
import com.aaa_battery.aaa_batteryproject.util.LoginTest;
import com.aaa_battery.aaa_batteryproject.util.LogoutTest;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ldap.embedded.EmbeddedLdapProperties.Credential;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthenticationBTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthenticationService authenticationService;

    @MockBean
    private JwtService jwtService;

    private final String JWT_STRING = "mock-jwt-token";

    @Test
    void testLoginBorrower_Successful() throws Exception {
        String email = Credentials.BORROWER.getEmail();
        String password = Credentials.BORROWER.getPassword();
        Role role = Role.BORROWER;

        LoginTest.setUp(authenticationService, jwtService, mockMvc, JWT_STRING, email, password, role);

        LoginTest.loginUser(
            authenticationService, jwtService, mockMvc, JWT_STRING, 
            email, password, role
            );

        LogoutTest.logoutUser(mockMvc, JWT_STRING);
    }

    @Test
    void testLoginLibrarian_Successful() throws Exception {
        String email = Credentials.LIBRARIAN.getEmail();
        String password = Credentials.LIBRARIAN.getPassword();
        Role role = Role.LIBRARIAN;

        LoginTest.setUp(authenticationService, jwtService, mockMvc, JWT_STRING, email, password, role);
        
        LoginTest.loginUser(
            authenticationService, jwtService, mockMvc, JWT_STRING, 
            email, password, role
        );
        
        LogoutTest.logoutUser(mockMvc, JWT_STRING);
    }

    @Test
    void testLoginBorrower_InvalidCredentials() throws Exception {
        String email = Credentials.INVALID.getEmail();
        String password = Credentials.INVALID.getPassword();
        Role role = Role.BORROWER;

        Mockito.when(authenticationService.authenticate(any(LoginUserDto.class)))
            .thenThrow(new IllegalArgumentException("An unexpected error occurred during login"));

        LoginTest.performInvalidLogin(
            authenticationService, mockMvc, 
            email, password, role
            );
    }

    @Test
    void testLoginLibrarian_InvalidCredentials() throws Exception {
        String email = Credentials.INVALID.getEmail();
        String password = Credentials.INVALID.getPassword();
        Role role = Role.LIBRARIAN;

        Mockito.when(authenticationService.authenticate(any(LoginUserDto.class)))
            .thenThrow(new IllegalArgumentException("An unexpected error occurred during login"));

        LoginTest.performInvalidLogin(
            authenticationService, mockMvc, 
            email, password, role
            );
    }

    @Test
    void testLoginBorrower_IncorrectPassword() throws Exception {
        String email = Credentials.BORROWER.getEmail();
        String password = Credentials.BORROWER_INCORRECT.getPassword();
        Role role = Role.BORROWER;

        Mockito.when(authenticationService.authenticate(any(LoginUserDto.class)))
            .thenThrow(new IllegalArgumentException("An unexpected error occurred during login"));

        LoginTest.performInvalidLogin(
            authenticationService, mockMvc, 
            email, password, role
            );
        
    }

    @Test
    void testLoginLibrarian_IncorrectPassword() throws Exception {
        String email = Credentials.LIBRARIAN.getEmail();
        String password = Credentials.LIBRARIAN_INCORRECT.getPassword();
        Role role = Role.LIBRARIAN;

        Mockito.when(authenticationService.authenticate(any(LoginUserDto.class)))
            .thenThrow(new IllegalArgumentException("An unexpected error occurred during login"));
        
        LoginTest.performInvalidLogin(
            authenticationService, mockMvc, 
            email, password, role
            );
    }
}