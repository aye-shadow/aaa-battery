package com.aaa_battery.aaa_batteryproject.requests;

import com.aaa_battery.aaa_batteryproject.item.model.ItemType;
import com.aaa_battery.aaa_batteryproject.requests.dto.RequestDTO;
import com.aaa_battery.aaa_batteryproject.requests.model.RequestEntity;
import com.aaa_battery.aaa_batteryproject.requests.model.RequestEntity.RequestStatus;
import com.aaa_battery.aaa_batteryproject.requests.service.RequestService;
import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;
import com.aaa_battery.aaa_batteryproject.user.services.BorrowerService;

import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import static org.hamcrest.Matchers.containsString;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class RequestTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private BorrowerService borrowerService;

    @MockBean
    private RequestService requestService;

    private RequestDTO validRequestDTO;
    private BorrowerEntity testBorrower;

    @BeforeEach
    void setUp() {
        // Setup test borrower
        testBorrower = new BorrowerEntity();
        testBorrower.setId((int) 1L);
        testBorrower.setFullName("Test Borrower");
        testBorrower.setEmail("borrower@test.com");

        // Setup valid request DTO
        validRequestDTO = new RequestDTO();
        validRequestDTO.setItemType("book");
        validRequestDTO.setItemName("Test Book");
        validRequestDTO.setItemBy("Test Author");
        validRequestDTO.setNotes("Test notes for the request");
    }

    @Test
    @WithMockUser(username = "borrower@test.com", roles = {"BORROWER"})
    void submitNewRequest_Success() throws Exception {
        // Arrange
        when(borrowerService.getAuthenticatedBorrower()).thenReturn(testBorrower);
        // Return a mock RequestEntity instead of an integer
        when(requestService.saveRequest(any(RequestDTO.class), any(BorrowerEntity.class))).thenReturn(mock(RequestEntity.class));

        // Act & Assert
        mockMvc.perform(post("/api/request/borrower/new-request")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRequestDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("Request submitted successfully"));

        // Verify
        verify(borrowerService, times(1)).getAuthenticatedBorrower();
        verify(requestService, times(1)).saveRequest(any(RequestDTO.class), eq(testBorrower));
    }

    @Test
    @WithMockUser(username = "librarian@test.com", roles = {"LIBRARIAN"})
    void submitNewRequest_WrongRole() throws Exception {
        // Act & Assert - Librarian role doesn't have permission for this endpoint
        mockMvc.perform(post("/api/request/borrower/new-request")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRequestDTO)))
                .andExpect(status().isForbidden());

        // Verify no service interactions
        verify(borrowerService, never()).getAuthenticatedBorrower();
        verify(requestService, never()).saveRequest(any(), any());
    }

    @Test
    @WithMockUser(username = "borrower@test.com", roles = {"BORROWER"})
    void submitNewRequest_EmptyRequestBody() throws Exception {
        // Arrange
        when(borrowerService.getAuthenticatedBorrower()).thenReturn(testBorrower);
        when(requestService.saveRequest(any(RequestDTO.class), any(BorrowerEntity.class))).thenReturn(mock(RequestEntity.class));

        // Act & Assert
        mockMvc.perform(post("/api/request/borrower/new-request")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isOk())
                .andExpect(content().string("Request submitted successfully"));

        // Verify service interactions still occur with empty body
        verify(borrowerService, times(1)).getAuthenticatedBorrower();
        verify(requestService, times(1)).saveRequest(any(), any());
    }

    @Test
    @WithMockUser(username = "borrower@test.com", roles = {"BORROWER"})
    void submitNewRequest_NullBorrower() throws Exception {
        // Arrange
        when(borrowerService.getAuthenticatedBorrower()).thenReturn(null);

        // Act & Assert
        mockMvc.perform(post("/api/request/borrower/new-request")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRequestDTO)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Failed to submit the request"));

        // Verify
        verify(borrowerService, times(1)).getAuthenticatedBorrower();
        verify(requestService, never()).saveRequest(any(), any());
    }

    @Test
    @WithMockUser(username = "borrower@test.com", roles = {"BORROWER"})
    void submitNewRequest_ServiceException() throws Exception {
        // Arrange
        when(borrowerService.getAuthenticatedBorrower()).thenReturn(testBorrower);
        doThrow(new RuntimeException("Service error")).when(requestService)
                .saveRequest(any(RequestDTO.class), any(BorrowerEntity.class));

        // Act & Assert
        mockMvc.perform(post("/api/request/borrower/new-request")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRequestDTO)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Failed to submit the request"));

        // Verify
        verify(borrowerService, times(1)).getAuthenticatedBorrower();
        verify(requestService, times(1)).saveRequest(any(), any());
    }

    @Test
    @WithMockUser(username = "borrower@test.com", roles = {"BORROWER"})
    void submitNewRequest_MalformedJson() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/request/borrower/new-request")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{malformed json}"))
                .andExpect(status().isBadRequest());

        // Verify no service interactions
        verify(borrowerService, never()).getAuthenticatedBorrower();
        verify(requestService, never()).saveRequest(any(), any());
    }

    @Test
    @WithMockUser(username = "borrower@test.com", roles = {"BORROWER"})
    void viewMyRequests_Success() throws Exception {
        // Arrange
        List<RequestEntity> mockRequests = List.of(mock(RequestEntity.class), mock(RequestEntity.class));
        when(borrowerService.getAuthenticatedBorrower()).thenReturn(testBorrower);
        when(requestService.findByRequestor(testBorrower)).thenReturn(mockRequests);
    
        // Act & Assert
        mockMvc.perform(get("/api/request/borrower/my-requests")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    
        // Verify
        verify(borrowerService, times(1)).getAuthenticatedBorrower();
        verify(requestService, times(1)).findByRequestor(testBorrower);
    }
    
    @Test
    @WithMockUser(username = "borrower@test.com", roles = {"BORROWER"})
    void viewMyRequests_NullBorrower() throws Exception {
        // Arrange
        when(borrowerService.getAuthenticatedBorrower()).thenReturn(null);
    
        // Act & Assert
        mockMvc.perform(get("/api/request/borrower/my-requests")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    
        // Verify
        verify(borrowerService, times(1)).getAuthenticatedBorrower();
        verify(requestService, never()).findByRequestor(any());
    }
    
    @Test
    @WithMockUser(username = "borrower@test.com", roles = {"BORROWER"})
    void viewMyRequests_IllegalArgumentException() throws Exception {
        // Arrange
        when(borrowerService.getAuthenticatedBorrower()).thenReturn(testBorrower);
        when(requestService.findByRequestor(any())).thenThrow(new IllegalArgumentException("Test exception"));
    
        // Act & Assert
        mockMvc.perform(get("/api/request/borrower/my-requests")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    
        // Verify
        verify(borrowerService, times(1)).getAuthenticatedBorrower();
        verify(requestService, times(1)).findByRequestor(testBorrower);
    }
    
    @Test
    @WithMockUser(username = "borrower@test.com", roles = {"BORROWER"})
    void viewMyRequests_ServiceException() throws Exception {
        // Arrange
        when(borrowerService.getAuthenticatedBorrower()).thenReturn(testBorrower);
        when(requestService.findByRequestor(any())).thenThrow(new RuntimeException("Test exception"));
    
        // Act & Assert
        mockMvc.perform(get("/api/request/borrower/my-requests")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Error fetching requests: Test exception")); // Match the actual error response 
    
        // Verify
        verify(borrowerService, times(1)).getAuthenticatedBorrower();
        verify(requestService, times(1)).findByRequestor(testBorrower);
    }
    
    @Test
    @WithMockUser(username = "librarian@test.com", roles = {"LIBRARIAN"})
    void viewMyRequests_WrongRole() throws Exception {
        // Act & Assert - Librarian role doesn't have permission for this endpoint
        mockMvc.perform(get("/api/request/borrower/my-requests")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    
        // Verify no service interactions
        verify(borrowerService, never()).getAuthenticatedBorrower();
        verify(requestService, never()).findByRequestor(any());
    }

    @Test
    @WithMockUser(username = "librarian@test.com", roles = {"LIBRARIAN"})
    void viewRequests_Success() throws Exception {
        // Arrange
        RequestEntity mockRequest = mock(RequestEntity.class);
        BorrowerEntity mockBorrower = mock(BorrowerEntity.class);
        
        when(mockRequest.getId()).thenReturn(1);
        when(mockRequest.getItemType()).thenReturn(mock(ItemType.class));
        when(mockRequest.getItemName()).thenReturn("Test Book");
        when(mockRequest.getItemBy()).thenReturn("Test Author");
        when(mockRequest.getStatus()).thenReturn(RequestEntity.RequestStatus.PENDING);
        when(mockRequest.getRequestDate()).thenReturn(java.time.LocalDateTime.now());
        when(mockRequest.getNotes()).thenReturn("Test notes");
        when(mockRequest.getReason()).thenReturn(null);
        when(mockRequest.getRequestor()).thenReturn(mockBorrower);
        
        when(mockBorrower.getId()).thenReturn(1);
        when(mockBorrower.getFullName()).thenReturn("Test Borrower");
        when(mockBorrower.getEmail()).thenReturn("borrower@test.com");
        
        List<RequestEntity> mockRequests = List.of(mockRequest);
        when(requestService.getAllRequests()).thenReturn(mockRequests);

        // Act & Assert
        mockMvc.perform(get("/api/request/librarian/view-requests")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        // Verify
        verify(requestService, times(1)).getAllRequests();
    }

    @Test
    @WithMockUser(username = "librarian@test.com", roles = {"LIBRARIAN"})
    void viewRequests_EmptyList() throws Exception {
        // Arrange
        when(requestService.getAllRequests()).thenReturn(List.of());

        // Act & Assert
        mockMvc.perform(get("/api/request/librarian/view-requests")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        // Verify
        verify(requestService, times(1)).getAllRequests();
    }

    @Test
    @WithMockUser(username = "librarian@test.com", roles = {"LIBRARIAN"})
    void viewRequests_Exception() throws Exception {
        // Arrange
        when(requestService.getAllRequests()).thenThrow(new RuntimeException("Test exception"));

        // Act & Assert
        mockMvc.perform(get("/api/request/librarian/view-requests")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError());

        // Verify
        verify(requestService, times(1)).getAllRequests();
    }

    @Test
    @WithMockUser(username = "borrower@test.com", roles = {"BORROWER"})
    void viewRequests_WrongRole() throws Exception {
        // Act & Assert - Borrower role doesn't have permission for this endpoint
        mockMvc.perform(get("/api/request/librarian/view-requests")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        // Verify no service interactions
        verify(requestService, never()).getAllRequests();
    }
}