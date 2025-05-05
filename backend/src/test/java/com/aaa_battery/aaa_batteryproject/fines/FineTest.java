package com.aaa_battery.aaa_batteryproject.fines;

import com.aaa_battery.aaa_batteryproject.fines.controller.FineController;
import com.aaa_battery.aaa_batteryproject.fines.dto.BorrowerFineDTO;
import com.aaa_battery.aaa_batteryproject.fines.dto.FineInfoDTO;
import com.aaa_battery.aaa_batteryproject.fines.model.FineEntity;
import com.aaa_battery.aaa_batteryproject.fines.repository.FineRepository;
import com.aaa_battery.aaa_batteryproject.user.model.BorrowerEntity;
import com.aaa_battery.aaa_batteryproject.user.repositories.BorrowerRepository;
import com.aaa_battery.aaa_batteryproject.borrows.model.BorrowEntity;
import com.aaa_battery.aaa_batteryproject.item.model.ItemEntity;
import com.aaa_battery.aaa_batteryproject.item.itemdescriptions.models.ItemDescriptionEntity;
import org.junit.jupiter.api.*;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.TimeUnit;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class FineControllerTest {

    @Mock
    private FineRepository fineRepository;

    @Mock
    private BorrowerRepository borrowerRepository;

    @InjectMocks
    private FineController fineController;

    @Mock
    private Authentication authentication;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        SecurityContextHolder.clearContext();
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @Test
    void getAllFines_ReturnsFineInfoDTOList() {
        BorrowerEntity borrower = new BorrowerEntity();
        borrower.setId(1);
        borrower.setFullName("John Doe");

        ItemDescriptionEntity itemDescription = new ItemDescriptionEntity();
        itemDescription.setItemName("Book Title");

        ItemEntity item = new ItemEntity();
        item.setItemId(10);
        item.setDescription(itemDescription);

        BorrowEntity borrow = new BorrowEntity();
        borrow.setItem(item);

        FineEntity fine = new FineEntity();
        fine.setId((int) 100L);
        fine.setBorrower(borrower);
        fine.setBorrow(borrow);
        fine.setAmount(new BigDecimal("5.00").doubleValue());
        fine.setPaid(false);

        when(fineRepository.findAll()).thenReturn(Collections.singletonList(fine));

        List<FineInfoDTO> result = fineController.getAllFines();

        assertEquals(1, result.size());
        FineInfoDTO dto = result.get(0);
        assertEquals(100, dto.getFineId());
        assertEquals("John Doe", dto.getBorrowerName());
        assertEquals("Book Title", dto.getItemName());
        assertEquals(5.0, dto.getAmount());
        assertFalse(dto.getPaid());

        verify(fineRepository).findAll();
    }

    @Test
    void getAllFines_ReturnsEmptyListWhenNoFines() {
        when(fineRepository.findAll()).thenReturn(Collections.emptyList());

        List<FineInfoDTO> result = fineController.getAllFines();

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(fineRepository).findAll();
    }

    @Test
    void getAllFines_BorrowerOrItemNull_ReturnsUnknown() {
        FineEntity fine1 = new FineEntity();
        fine1.setId((int) 1L);
        fine1.setBorrower(null); // borrower is null
        fine1.setBorrow(null);   // borrow is null
        fine1.setAmount(new BigDecimal("2.00").doubleValue());
        fine1.setPaid(true);

        // borrow exists but item is null
        BorrowEntity borrow = new BorrowEntity();
        borrow.setItem(null);

        FineEntity fine2 = new FineEntity();
        fine2.setId((int) 2L);
        fine2.setBorrower(new BorrowerEntity());
        fine2.getBorrower().setFullName("Jane Doe");
        fine2.setBorrow(borrow);
        fine2.setAmount(new BigDecimal("3.00").doubleValue());
        fine2.setPaid(false);

        when(fineRepository.findAll()).thenReturn(Arrays.asList(fine1, fine2));

        List<FineInfoDTO> result = fineController.getAllFines();

        assertEquals(2, result.size());
        assertEquals("Unknown", result.get(0).getBorrowerName());
        assertEquals("Unknown", result.get(0).getItemName());
        assertEquals("Jane Doe", result.get(1).getBorrowerName());
        assertEquals("Unknown", result.get(1).getItemName());
    }

    @Test
    void getBorrowerFines_BorrowerExistsWithFines_ReturnsFineDTOs() {
        String email = "user@example.com";
        when(authentication.getName()).thenReturn(email);

        BorrowerEntity borrower = new BorrowerEntity();
        borrower.setId(1);
        borrower.setEmail(email);

        when(borrowerRepository.findByEmail(email)).thenReturn(Optional.of(borrower));

        // Fine with borrow and item
        ItemDescriptionEntity desc = new ItemDescriptionEntity();
        desc.setItemName("Book Title");
        ItemEntity item = new ItemEntity();
        item.setItemId(10);
        item.setDescription(desc);
        BorrowEntity borrow = new BorrowEntity();
        borrow.setItem(item);
        Date borrowDate = new Date(System.currentTimeMillis() - TimeUnit.DAYS.toMillis(10));
        Date returnDate = new Date(System.currentTimeMillis() - TimeUnit.DAYS.toMillis(5));
        borrow.setBorrowDate(borrowDate);
        borrow.setReturnDate(returnDate);

        FineEntity fine = new FineEntity();
        fine.setId(100);
        fine.setAmount(5.0);
        fine.setPaid(false);
        fine.setIssuedDate(new Date());
        fine.setBorrow(borrow);

        when(fineRepository.findByBorrowerId(1)).thenReturn(Collections.singletonList(fine));

        ResponseEntity<List<BorrowerFineDTO>> response = fineController.getBorrowerFines();

        assertEquals(200, response.getStatusCode().value());
        List<BorrowerFineDTO> dtos = response.getBody();
        assertNotNull(dtos);
        assertEquals(1, dtos.size());
        BorrowerFineDTO dto = dtos.get(0);
        assertEquals(100, dto.getFineId());
        assertEquals(5.0, dto.getAmount());
        assertFalse(dto.getPaid());
        assertEquals(10, dto.getItemId());
        assertEquals("Book Title", dto.getItemName());
        assertEquals(borrowDate, dto.getBorrowDate());
        assertEquals(returnDate, dto.getReturnDate());
        assertTrue(dto.getDaysLate() >= 5); // Should be at least 5 days late
    }

    @Test
    void getBorrowerFines_BorrowerExistsWithFineButNoBorrowOrItem() {
        String email = "user2@example.com";
        when(authentication.getName()).thenReturn(email);

        BorrowerEntity borrower = new BorrowerEntity();
        borrower.setId(2);
        borrower.setEmail(email);

        when(borrowerRepository.findByEmail(email)).thenReturn(Optional.of(borrower));

        FineEntity fine = new FineEntity();
        fine.setId(200);
        fine.setAmount(3.0);
        fine.setPaid(true);
        fine.setIssuedDate(new Date());
        fine.setBorrow(null);

        when(fineRepository.findByBorrowerId(2)).thenReturn(Collections.singletonList(fine));

        ResponseEntity<List<BorrowerFineDTO>> response = fineController.getBorrowerFines();

        assertEquals(200, response.getStatusCode().value());
        List<BorrowerFineDTO> dtos = response.getBody();
        assertNotNull(dtos);
        assertEquals(1, dtos.size());
        BorrowerFineDTO dto = dtos.get(0);
        assertEquals(200, dto.getFineId());
        assertEquals(3.0, dto.getAmount());
        assertTrue(dto.getPaid());
        assertNull(dto.getItemId());
        assertNull(dto.getBorrowDate());
        assertNull(dto.getReturnDate());
        assertNull(dto.getItemName());
    }

    @Test
    void getBorrowerFines_BorrowerExistsWithNoFines_ReturnsEmptyList() {
        String email = "user3@example.com";
        when(authentication.getName()).thenReturn(email);

        BorrowerEntity borrower = new BorrowerEntity();
        borrower.setId(3);
        borrower.setEmail(email);

        when(borrowerRepository.findByEmail(email)).thenReturn(Optional.of(borrower));
        when(fineRepository.findByBorrowerId(3)).thenReturn(Collections.emptyList());

        ResponseEntity<List<BorrowerFineDTO>> response = fineController.getBorrowerFines();

        assertEquals(200, response.getStatusCode().value());
        List<BorrowerFineDTO> dtos = response.getBody();
        assertNotNull(dtos);
        assertTrue(dtos.isEmpty());
    }

    @Test
    void getBorrowerFines_BorrowerNotFound_ReturnsBadRequest() {
        String email = "notfound@example.com";
        when(authentication.getName()).thenReturn(email);

        when(borrowerRepository.findByEmail(email)).thenReturn(Optional.empty());

        ResponseEntity<List<BorrowerFineDTO>> response = fineController.getBorrowerFines();

        assertEquals(400, response.getStatusCode().value());
        assertNull(response.getBody());
    }

    @Test
    void getBorrowerFines_BorrowReturnDateNullOrFuture_DaysLateZero() {
        String email = "user4@example.com";
        when(authentication.getName()).thenReturn(email);

        BorrowerEntity borrower = new BorrowerEntity();
        borrower.setId(4);
        borrower.setEmail(email);

        when(borrowerRepository.findByEmail(email)).thenReturn(Optional.of(borrower));

        // Fine with borrow, returnDate null
        BorrowEntity borrow1 = new BorrowEntity();
        borrow1.setItem(null);
        borrow1.setBorrowDate(new Date());
        borrow1.setReturnDate(null);

        FineEntity fine1 = new FineEntity();
        fine1.setId(300);
        fine1.setAmount(2.0);
        fine1.setPaid(false);
        fine1.setIssuedDate(new Date());
        fine1.setBorrow(borrow1);

        // Fine with borrow, returnDate in the future
        BorrowEntity borrow2 = new BorrowEntity();
        borrow2.setItem(null);
        borrow2.setBorrowDate(new Date());
        borrow2.setReturnDate(new Date(System.currentTimeMillis() + TimeUnit.DAYS.toMillis(2)));

        FineEntity fine2 = new FineEntity();
        fine2.setId(301);
        fine2.setAmount(4.0);
        fine2.setPaid(false);
        fine2.setIssuedDate(new Date());
        fine2.setBorrow(borrow2);

        when(fineRepository.findByBorrowerId(4)).thenReturn(Arrays.asList(fine1, fine2));

        ResponseEntity<List<BorrowerFineDTO>> response = fineController.getBorrowerFines();

        assertEquals(200, response.getStatusCode().value());
        List<BorrowerFineDTO> dtos = response.getBody();
        assertNotNull(dtos);
        assertEquals(2, dtos.size());
        assertEquals(0, dtos.get(0).getDaysLate());
        assertEquals(0, dtos.get(1).getDaysLate());
    }
}