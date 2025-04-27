// filepath: backend/src/test/java/com/aaa_battery/aaa_batteryproject/AuthenticationControllerTest.java
package com.aaa_battery.aaa_batteryproject.authentication.whitebox;

import com.aaa_battery.aaa_batteryproject.authentication.service.AuthenticationService;
import com.aaa_battery.aaa_batteryproject.security.jwt.services.JwtService;
import com.aaa_battery.aaa_batteryproject.user.dtos.LoginUserDto;
import com.aaa_battery.aaa_batteryproject.user.roles.Role;
import com.aaa_battery.aaa_batteryproject.util.Credentials;
import com.aaa_battery.aaa_batteryproject.util.LoginTest;
import com.aaa_battery.aaa_batteryproject.util.LogoutTest;

import static org.mockito.ArgumentMatchers.any;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthenticationWTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthenticationService authenticationService;

    @MockBean
    private JwtService jwtService;

    private final String JWT_STRING = "mock-jwt-token";

    @Test
    public void testLogin_IncorrectRoleLibrarian() throws Exception {
        Mockito.when(authenticationService.authenticate(any(LoginUserDto.class)))
            .thenThrow(new IllegalArgumentException("Invalid credentials. Authentication failed."));

        LoginTest.performLoginIncorrectRole(
            authenticationService, jwtService, mockMvc, JWT_STRING, 
            Credentials.BORROWER.getEmail(), Credentials.BORROWER.getPassword(), Role.LIBRARIAN
            );
    }

    @Test
    public void testLogin_IncorrectRoleBorrower() throws Exception {
        Mockito.when(authenticationService.authenticate(any(LoginUserDto.class)))
            .thenThrow(new IllegalArgumentException("Invalid credentials. Authentication failed."));

        LoginTest.performLoginIncorrectRole(
            authenticationService, jwtService, mockMvc, JWT_STRING, 
            Credentials.LIBRARIAN.getEmail(), Credentials.LIBRARIAN.getPassword(), Role.BORROWER
            );
    }

    @Test
    public void testLogin_UserAlreadyLoggedIn() throws Exception {
        String email = Credentials.BORROWER.getEmail();
        String password = Credentials.BORROWER.getPassword();
        Role role = Role.BORROWER;

        LoginTest.setUp(authenticationService, jwtService, mockMvc, JWT_STRING, email, password, role);

        LoginTest.loginUser(
            authenticationService, jwtService, mockMvc, JWT_STRING, 
            email, password, role
            );

        LoginTest.secondLogin(
            authenticationService, jwtService, mockMvc, JWT_STRING, 
            Credentials.LIBRARIAN.getEmail(), Credentials.LIBRARIAN.getPassword(), Role.LIBRARIAN
            );

        LogoutTest.logoutUser(mockMvc, JWT_STRING);
    }

    @Test
    public void testLogout_NoLoggedIn() throws Exception {
        LogoutTest.logoutNoone(mockMvc);
    }

    @Test
    void testLogin_NullJWT() throws Exception {
        String email = Credentials.BORROWER.getEmail();
        String password = Credentials.BORROWER.getPassword();
        Role role = Role.BORROWER;

        LoginTest.setUp(
            authenticationService, jwtService, mockMvc, null, 
            email, password, role
            );

        LoginTest.performLoginWithNoJwt(
            authenticationService, jwtService, mockMvc, 
            email, password, role
            );
    }

    @Test
    void testLogin_EmptyJWT() throws Exception {
        String email = Credentials.BORROWER.getEmail();
        String password = Credentials.BORROWER.getPassword();
        Role role = Role.BORROWER;

        LoginTest.setUp(
            authenticationService, jwtService, mockMvc, "", 
            email, password, role
            );

        LoginTest.performLoginWithNoJwt(
            authenticationService, jwtService, mockMvc, 
            email, password, role
            );
    }
}