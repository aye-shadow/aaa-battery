// filepath: backend/src/test/java/com/aaa_battery/aaa_batteryproject/AuthenticationControllerTest.java
package com.aaa_battery.aaa_batteryproject.authentication.whitebox;

import com.aaa_battery.aaa_batteryproject.authentication.service.AuthenticationService;
import com.aaa_battery.aaa_batteryproject.authentication.util.LoginTest;
import com.aaa_battery.aaa_batteryproject.authentication.util.LogoutTest;
import com.aaa_battery.aaa_batteryproject.authentication.util.RegisterTest;
import com.aaa_battery.aaa_batteryproject.security.jwt.services.JwtService;
import com.aaa_battery.aaa_batteryproject.user.dtos.LoginUserDto;
import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;
import com.aaa_battery.aaa_batteryproject.user.model.UserEntity;
import com.aaa_battery.aaa_batteryproject.user.roles.Role;

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
            com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.BORROWER.getEmail(), com.aaa_battery.aaa_batteryproject.authentication.util.Credential.BORROWER.getPassword(), Role.LIBRARIAN
            );
    }

    @Test
    public void testLogin_IncorrectRoleBorrower() throws Exception {
        Mockito.when(authenticationService.authenticate(any(LoginUserDto.class)))
            .thenThrow(new IllegalArgumentException("Invalid credentials. Authentication failed."));

        LoginTest.performLoginIncorrectRole(
            authenticationService, jwtService, mockMvc, JWT_STRING, 
            com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.LIBRARIAN.getEmail(), com.aaa_battery.aaa_batteryproject.authentication.util.Credential.LIBRARIAN.getPassword(), Role.BORROWER
            );
    }

    @Test
    public void testLogin_UserAlreadyLoggedIn() throws Exception {
        String email = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.BORROWER.getEmail();
        String password = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.BORROWER.getPassword();
        Role role = Role.BORROWER;

        LoginTest.setUp(authenticationService, jwtService, mockMvc, JWT_STRING, email, password, role);

        LoginTest.loginUser(
            authenticationService, jwtService, mockMvc, JWT_STRING, 
            email, password, role
            );

        LoginTest.secondLogin(
            authenticationService, jwtService, mockMvc, JWT_STRING, 
            com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.LIBRARIAN.getEmail(), com.aaa_battery.aaa_batteryproject.authentication.util.Credential.LIBRARIAN.getPassword(), Role.LIBRARIAN
            );

        LogoutTest.logoutUser(mockMvc, JWT_STRING);
    }

    @Test
    public void testLogout_NoLoggedIn() throws Exception {
        LogoutTest.logoutNoone(mockMvc);
    }

    @Test
    void testLogin_NullJWT() throws Exception {
        String email = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.BORROWER.getEmail();
        String password = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.BORROWER.getPassword();
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
        String email = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.BORROWER.getEmail();
        String password = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.BORROWER.getPassword();
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

    @Test
    void testLogin_InvalidRoleFromFrontend() throws Exception {
        String email = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.BORROWER.getEmail();
        String password = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.BORROWER.getPassword();
        String invalidRole = "ADMIN";

        LoginTest.performLoginWithInvalidRole(
            authenticationService, jwtService, mockMvc, 
            email, password, invalidRole
            );
    }

    @Test
    void testRegister_InvalidRoleFromFrontend() throws Exception {
        String email = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.NEW_BORROWER.getEmail();
        String password = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.NEW_BORROWER.getPassword();

        UserEntity newBorrower = new BorrowerEntity()
            .setEmail(email)
            .setPassword(password) 
            .setUsername(email)
            .setFullName(com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.NEW_BORROWER.getFullName())
            .setCreatedAt(new java.util.Date())
            .setUpdatedAt(new java.util.Date());

        RegisterTest.registerWithMissingRole(authenticationService, mockMvc, newBorrower, "Password is required");
    }
}