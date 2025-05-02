// filepath: backend/src/test/java/com/aaa_battery/aaa_batteryproject/AuthenticationControllerTest.java
package com.aaa_battery.aaa_batteryproject.authentication;

import com.aaa_battery.aaa_batteryproject.authentication.service.AuthenticationService;
import com.aaa_battery.aaa_batteryproject.authentication.util.LoginTest;
import com.aaa_battery.aaa_batteryproject.authentication.util.LogoutTest;
import com.aaa_battery.aaa_batteryproject.authentication.util.RegisterTest;
import com.aaa_battery.aaa_batteryproject.security.jwt.services.JwtService;
import com.aaa_battery.aaa_batteryproject.user.dtos.LoginUserDto;
import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;
import com.aaa_battery.aaa_batteryproject.user.model.LibrarianEntity;
import com.aaa_battery.aaa_batteryproject.user.model.UserEntity;
import com.aaa_battery.aaa_batteryproject.user.roles.Role;
import com.aaa_battery.aaa_batteryproject.authentication.util.Credentials;

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
public class AuthenticationTest {

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
    
        // Only return user for valid credentials
        UserEntity user = new UserEntity();
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(role);
    
        Mockito.when(authenticationService.authenticate(
            Mockito.argThat(dto ->
                email.equals(dto.getEmail()) &&
                password.equals(dto.getPassword()) &&
                role == dto.getRole()
            )
        )).thenReturn(user);
    
        Mockito.when(jwtService.generateToken(Mockito.any())).thenReturn(JWT_STRING);
        Mockito.when(jwtService.getExpirationTime()).thenReturn(3600L);
    
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
    
        // Only return user for valid credentials
        UserEntity user = new UserEntity();
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(role);
    
        Mockito.when(authenticationService.authenticate(
            Mockito.argThat(dto ->
                email.equals(dto.getEmail()) &&
                password.equals(dto.getPassword()) &&
                role == dto.getRole()
            )
        )).thenReturn(user);
    
        Mockito.when(jwtService.generateToken(Mockito.any())).thenReturn(JWT_STRING);
        Mockito.when(jwtService.getExpirationTime()).thenReturn(3600L);
    
        LoginTest.loginUser(
            authenticationService, jwtService, mockMvc, JWT_STRING, 
            email, password, role
        );
    
        LogoutTest.logoutUser(mockMvc, JWT_STRING);
    }

    @Test
    void testLoginBorrower_InvalidCredentials() throws Exception {
        String validEmail = Credentials.BORROWER.getEmail();
        String validPassword = Credentials.BORROWER.getPassword();
        Role role = Role.BORROWER;

        // Throw for invalid credentials
        Mockito.when(authenticationService.authenticate(
            Mockito.argThat(dto ->
                !validEmail.equals(dto.getEmail()) ||
                !validPassword.equals(dto.getPassword()) ||
                role != dto.getRole()
            )
        )).thenThrow(new IllegalArgumentException("An unexpected error occurred during login"));

        String invalidEmail = Credentials.INVALID.getEmail();
        String invalidPassword = Credentials.INVALID.getPassword();

        LoginTest.performInvalidLogin(
            authenticationService, mockMvc, 
            invalidEmail, invalidPassword, role
        );
    }

    @Test
    void testLoginLibrarian_InvalidCredentials() throws Exception {
        String email = Credentials.INVALID.getEmail();
        String password = Credentials.INVALID.getPassword();
        Role role = Role.LIBRARIAN;

        LoginTest.mockitoCall(authenticationService);

        LoginTest.performInvalidLogin(
            authenticationService, mockMvc, 
            email, password, role
            );
    }

    @Test
    void testLoginBorrower_IncorrectPassword() throws Exception {
        String correctEmail = Credentials.BORROWER.getEmail();
        String correctPassword = Credentials.BORROWER.getPassword();
        String incorrectPassword = Credentials.BORROWER_INCORRECT.getPassword();
        Role role = Role.BORROWER;

        // Throw for any other credentials (including incorrect password)
        Mockito.when(authenticationService.authenticate(
            Mockito.argThat(dto ->
                !correctEmail.equals(dto.getEmail()) ||
                !correctPassword.equals(dto.getPassword()) ||
                role != dto.getRole()
            )
        )).thenThrow(new IllegalArgumentException("An unexpected error occurred during login"));

        LoginTest.performInvalidLogin(
            authenticationService, mockMvc, 
            correctEmail, incorrectPassword, role
        );
    }

    @Test
    void testLoginLibrarian_IncorrectPassword() throws Exception {
        String correctEmail = Credentials.LIBRARIAN.getEmail();
        String correctPassword = Credentials.LIBRARIAN.getPassword();
        String incorrectPassword = Credentials.LIBRARIAN_INCORRECT.getPassword();
        Role role = Role.LIBRARIAN;

        // Throw for any other credentials (including incorrect password)
        Mockito.when(authenticationService.authenticate(
            Mockito.argThat(dto ->
                !correctEmail.equals(dto.getEmail()) ||
                !correctPassword.equals(dto.getPassword()) ||
                role != dto.getRole()
            )
        )).thenThrow(new IllegalArgumentException("An unexpected error occurred during login"));

        LoginTest.performInvalidLogin(
            authenticationService, mockMvc, 
            correctEmail, incorrectPassword, role
        );
    }

    @Test
    void testLoginBorrower_MissingEmail() throws Exception {
        String validEmail = Credentials.BORROWER.getEmail();
        String validPassword = Credentials.BORROWER.getPassword();
        Role role = Role.BORROWER;

        // Throw for any other credentials (including missing email)
        Mockito.when(authenticationService.authenticate(
            Mockito.argThat(dto ->
                (!"".equals(dto.getEmail()) ? !validEmail.equals(dto.getEmail()) : true) ||
                !validPassword.equals(dto.getPassword()) ||
                role != dto.getRole()
            )
        )).thenThrow(new IllegalArgumentException("An unexpected error occurred during login"));

        LoginTest.performInvalidLogin(
            authenticationService, mockMvc, 
            "", validPassword, role
        );
    }

    @Test
    void testLoginBorrower_MissingPassword() throws Exception {
        String validEmail = Credentials.BORROWER.getEmail();
        String validPassword = Credentials.BORROWER.getPassword();
        Role role = Role.BORROWER;

        // Throw for any other credentials (including missing password)
        Mockito.when(authenticationService.authenticate(
            Mockito.argThat(dto ->
                !validEmail.equals(dto.getEmail()) ||
                (!"".equals(dto.getPassword()) ? !validPassword.equals(dto.getPassword()) : true) ||
                role != dto.getRole()
            )
        )).thenThrow(new IllegalArgumentException("An unexpected error occurred during login"));

        LoginTest.performInvalidLogin(
            authenticationService, mockMvc, 
            validEmail, "", role
        );
    }

    @Test
    void testRegisterLibrarian_Successful() throws Exception {
        String email = Credentials.NEW_LIBRARIAN.getEmail();
        String password = Credentials.NEW_LIBRARIAN.getPassword();
        Role role = Role.LIBRARIAN;

        UserEntity registeredLibrarian = new LibrarianEntity()
            .setEmail(email)
            .setPassword(password)
            .setRole(role)
            .setUsername(email)
            .setFullName(Credentials.NEW_LIBRARIAN.getFullName())
            .setCreatedAt(new java.util.Date())
            .setUpdatedAt(new java.util.Date());

        RegisterTest.registerUser(authenticationService, mockMvc, registeredLibrarian);
    }

    @Test
    void testRegisterBorrower_Successful() throws Exception {
        String email = Credentials.NEW_BORROWER.getEmail();
        String password = Credentials.NEW_BORROWER.getPassword();
        Role role = Role.BORROWER;

        UserEntity registeredBorrower = new BorrowerEntity()
            .setEmail(email)
            .setPassword(password)
            .setRole(role)
            .setUsername(email)
            .setFullName(Credentials.NEW_BORROWER.getFullName())
            .setCreatedAt(new java.util.Date())
            .setUpdatedAt(new java.util.Date());

        RegisterTest.registerUser(authenticationService, mockMvc, registeredBorrower);
    }

    @Test
    void testRegisterBorrower_MissingFullName() throws Exception {
        String email = Credentials.NEW_BORROWER.getEmail();
        String password = Credentials.NEW_BORROWER.getPassword();
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
        String password = Credentials.NEW_BORROWER.getPassword();
        Role role = Role.BORROWER;

        UserEntity registeredBorrower = new BorrowerEntity()
            .setEmail("") // Missing email
            .setPassword(password)
            .setRole(role)
            .setUsername("")
            .setFullName(Credentials.NEW_BORROWER.getFullName())
            .setCreatedAt(new java.util.Date())
            .setUpdatedAt(new java.util.Date());

        RegisterTest.registerUserWrong(authenticationService, mockMvc, registeredBorrower, "Email is required");
    }

    @Test
    void testRegisterBorrower_MissingPassword() throws Exception {
        String email = Credentials.NEW_BORROWER.getEmail();
        Role role = Role.BORROWER;

        UserEntity registeredBorrower = new BorrowerEntity()
            .setEmail(email)
            .setPassword("") // Missing password
            .setRole(role)
            .setUsername(email)
            .setFullName(Credentials.NEW_BORROWER.getFullName())
            .setCreatedAt(new java.util.Date())
            .setUpdatedAt(new java.util.Date());

        RegisterTest.registerUserWrong(authenticationService, mockMvc, registeredBorrower, "Password is required");
    }

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

    @Test
    void testLogin_InvalidRoleFromFrontend() throws Exception {
        String email = Credentials.BORROWER.getEmail();
        String password = Credentials.BORROWER.getPassword();
        String invalidRole = "ADMIN";

        LoginTest.performLoginWithInvalidRole(
            authenticationService, jwtService, mockMvc, 
            email, password, invalidRole
            );
    }

    @Test
    void testRegister_InvalidRoleFromFrontend() throws Exception {
        String email = Credentials.NEW_BORROWER.getEmail();
        String password = Credentials.NEW_BORROWER.getPassword();

        UserEntity newBorrower = new BorrowerEntity()
            .setEmail(email)
            .setPassword(password) 
            .setUsername(email)
            .setFullName(Credentials.NEW_BORROWER.getFullName())
            .setCreatedAt(new java.util.Date())
            .setUpdatedAt(new java.util.Date());

        RegisterTest.registerWithMissingRole(authenticationService, mockMvc, newBorrower, "Password is required");
    }
}