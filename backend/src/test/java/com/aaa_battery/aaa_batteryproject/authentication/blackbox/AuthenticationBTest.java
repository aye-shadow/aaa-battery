package com.aaa_battery.aaa_batteryproject.authentication.blackbox;

import com.aaa_battery.aaa_batteryproject.authentication.service.AuthenticationService;
import com.aaa_battery.aaa_batteryproject.authentication.util.LoginTest;
import com.aaa_battery.aaa_batteryproject.authentication.util.LogoutTest;
import com.aaa_battery.aaa_batteryproject.authentication.util.RegisterTest;
import com.aaa_battery.aaa_batteryproject.security.jwt.services.JwtService;
import com.aaa_battery.aaa_batteryproject.user.model.LibrarianEntity;
import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;
import com.aaa_battery.aaa_batteryproject.user.model.UserEntity;
import com.aaa_battery.aaa_batteryproject.user.roles.Role;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
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
        String email = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.BORROWER.getEmail();
        String password = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.BORROWER.getPassword();
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
        String email = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.LIBRARIAN.getEmail();
        String password = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.LIBRARIAN.getPassword();
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
        String email = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.INVALID.getEmail();
        String password = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.INVALID.getPassword();
        Role role = Role.BORROWER;

        LoginTest.mockitoCall(authenticationService);

        LoginTest.performInvalidLogin(
            authenticationService, mockMvc, 
            email, password, role
            );
    }

    @Test
    void testLoginLibrarian_InvalidCredentials() throws Exception {
        String email = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.INVALID.getEmail();
        String password = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.INVALID.getPassword();
        Role role = Role.LIBRARIAN;

        LoginTest.mockitoCall(authenticationService);

        LoginTest.performInvalidLogin(
            authenticationService, mockMvc, 
            email, password, role
            );
    }

    @Test
    void testLoginBorrower_IncorrectPassword() throws Exception {
        String email = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.BORROWER.getEmail();
        String password = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.BORROWER_INCORRECT.getPassword();
        Role role = Role.BORROWER;

        LoginTest.mockitoCall(authenticationService);

        LoginTest.performInvalidLogin(
            authenticationService, mockMvc, 
            email, password, role
            );
        
    }

    @Test
    void testLoginLibrarian_IncorrectPassword() throws Exception {
        String email = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.LIBRARIAN.getEmail();
        String password = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.LIBRARIAN_INCORRECT.getPassword();
        Role role = Role.LIBRARIAN;

        LoginTest.mockitoCall(authenticationService);
        
        LoginTest.performInvalidLogin(
            authenticationService, mockMvc, 
            email, password, role
            );
    }

    @Test
    void testLoginBorrower_MissingEmail() throws Exception {
        String password = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.BORROWER.getPassword();
        Role role = Role.BORROWER;

        LoginTest.mockitoCall(authenticationService);

        LoginTest.performInvalidLogin(
            authenticationService, mockMvc, 
            "", password, role
        );
    }

    @Test
    void testLoginBorrower_MissingPassword() throws Exception {
        String email = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.BORROWER.getEmail();
        Role role = Role.BORROWER;

        LoginTest.mockitoCall(authenticationService);

        LoginTest.performInvalidLogin(
            authenticationService, mockMvc, 
            email, "", role
        );
    }

    @Test
    void testRegisterLibrarian_Successful() throws Exception {
        String email = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.NEW_LIBRARIAN.getEmail();
        String password = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.NEW_LIBRARIAN.getPassword();
        Role role = Role.LIBRARIAN;

        UserEntity registeredLibrarian = new LibrarianEntity()
            .setEmail(email)
            .setPassword(password)
            .setRole(role)
            .setUsername(email)
            .setFullName(com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.NEW_LIBRARIAN.getFullName())
            .setCreatedAt(new java.util.Date())
            .setUpdatedAt(new java.util.Date());

        RegisterTest.registerUser(authenticationService, mockMvc, registeredLibrarian);
    }

    @Test
    void testRegisterBorrower_Successful() throws Exception {
        String email = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.NEW_BORROWER.getEmail();
        String password = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.NEW_BORROWER.getPassword();
        Role role = Role.BORROWER;

        UserEntity registeredBorrower = new BorrowerEntity()
            .setEmail(email)
            .setPassword(password)
            .setRole(role)
            .setUsername(email)
            .setFullName(com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.NEW_BORROWER.getFullName())
            .setCreatedAt(new java.util.Date())
            .setUpdatedAt(new java.util.Date());

        RegisterTest.registerUser(authenticationService, mockMvc, registeredBorrower);
    }

    @Test
    void testRegisterBorrower_MissingFullName() throws Exception {
        String email = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.NEW_BORROWER.getEmail();
        String password = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.NEW_BORROWER.getPassword();
        Role role = Role.BORROWER;

        UserEntity registeredBorrower = new BorrowerEntity()
            .setEmail(email)
            .setPassword(password)
            .setRole(role)
            .setUsername(email)
            .setFullName("") // Missing full name
            .setCreatedAt(new java.util.Date())
            .setUpdatedAt(new java.util.Date());

        RegisterTest.registerUserWrong(authenticationService, mockMvc, registeredBorrower, "Name is required");
    }

    @Test
    void testRegisterBorrower_MissingEmail() throws Exception {
        String password = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.NEW_BORROWER.getPassword();
        Role role = Role.BORROWER;

        UserEntity registeredBorrower = new BorrowerEntity()
            .setEmail("") // Missing email
            .setPassword(password)
            .setRole(role)
            .setUsername("")
            .setFullName(com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.NEW_BORROWER.getFullName())
            .setCreatedAt(new java.util.Date())
            .setUpdatedAt(new java.util.Date());

        RegisterTest.registerUserWrong(authenticationService, mockMvc, registeredBorrower, "Email is required");
    }

    @Test
    void testRegisterBorrower_MissingPassword() throws Exception {
        String email = com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.NEW_BORROWER.getEmail();
        Role role = Role.BORROWER;

        UserEntity registeredBorrower = new BorrowerEntity()
            .setEmail(email)
            .setPassword("") // Missing password
            .setRole(role)
            .setUsername(email)
            .setFullName(com.aaa_battery.aaa_batteryproject.authentication.util.Credentials.NEW_BORROWER.getFullName())
            .setCreatedAt(new java.util.Date())
            .setUpdatedAt(new java.util.Date());

        RegisterTest.registerUserWrong(authenticationService, mockMvc, registeredBorrower, "Password is required");
    }
}