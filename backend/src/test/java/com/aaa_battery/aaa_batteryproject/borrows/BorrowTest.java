// package com.aaa_battery.aaa_batteryproject.borrows;

// import com.aaa_battery.aaa_batteryproject.borrows.util.BorrowTestUtil;
// import com.aaa_battery.aaa_batteryproject.borrows.service.BorrowService;
// import com.aaa_battery.aaa_batteryproject.item.service.ItemService;
// import com.aaa_battery.aaa_batteryproject.user.services.BorrowerService;
// import com.aaa_battery.aaa_batteryproject.security.jwt.services.JwtService;

// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.boot.test.mock.mockito.MockBean;
// import org.springframework.test.web.servlet.MockMvc;
// import static org.mockito.Mockito.*;

// @SpringBootTest
// @AutoConfigureMockMvc
// public class BorrowTest {

//    @Autowired
//    private MockMvc mockMvc;

//    @MockBean
//    private ItemService itemService;

//    @MockBean
//    private BorrowerService borrowerService;

//    @MockBean
//    private BorrowService borrowService;

//    @MockBean
//    private JwtService jwtService;

//    private final String JWT_STRING = "mock-jwt-token";

//    @Test
//    void testSubmitBorrow_Success() throws Exception {
//        BorrowTestUtil.setUpSubmitBorrowSuccess(borrowerService, itemService, borrowService);
//        BorrowTestUtil.performSubmitBorrow(mockMvc, JWT_STRING);
//    }

//    @Test
//    void testSubmitBorrow_NoItemFound() throws Exception {
//        BorrowTestUtil.setUpSubmitBorrowItemNotFound(borrowerService, itemService);
//        BorrowTestUtil.performSubmitBorrowExpectBadRequest(mockMvc, JWT_STRING);
//    }

//    @Test
//    void testSubmitBorrow_BorrowerNotFound() throws Exception {
//        BorrowTestUtil.setUpSubmitBorrowBorrowerNotFound(borrowerService);
//        BorrowTestUtil.performSubmitBorrowExpectNotFound(mockMvc, JWT_STRING);
//    }

//    @Test
//    void testGetMyBorrows_Success() throws Exception {
//        BorrowTestUtil.setUpGetMyBorrows(borrowerService);
//        BorrowTestUtil.performGetMyBorrows(mockMvc, JWT_STRING);
//    }

//    @Test
//    void testGetMyBorrows_BorrowerNotFound() throws Exception {
//        BorrowTestUtil.setUpBorrowerNotFound(borrowerService);
//        BorrowTestUtil.performGetMyBorrowsExpectNotFound(mockMvc, JWT_STRING);
//    }

//    @Test
//    void testReturnBorrow_Success() throws Exception {
//        BorrowTestUtil.setUpReturnBorrowSuccess(borrowerService, borrowService);
//        BorrowTestUtil.performReturnBorrow(mockMvc, JWT_STRING, 1L);
//    }

//    @Test
//    void testReturnBorrow_Forbidden() throws Exception {
//        BorrowTestUtil.setUpReturnBorrowForbidden(borrowerService, borrowService);
//        BorrowTestUtil.performReturnBorrowExpectForbidden(mockMvc, JWT_STRING, 2L);
//    }

//    @Test
//    void testReturnBorrow_BorrowNotFound() throws Exception {
//        BorrowTestUtil.setUpReturnBorrowNotFound(borrowerService, borrowService);
//        BorrowTestUtil.performReturnBorrowExpectNotFound(mockMvc, JWT_STRING, 999L);
//    }
// }
