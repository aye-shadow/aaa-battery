package com.aaa_battery.aaa_batteryproject.item.blackbox;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class ItemBTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(username = "i220899@nu.edu.pk", roles = {"LIBRARIAN"})
    void testLoginLibrarianAndAddBook() throws Exception {
        String bookJson = """
            {
                "itemName": "Test Book",
                "type": "book",
                "genre": "Fiction",
                "blurb": "A test book blurb.",
                "date": "2024-01-01T00:00:00",
                "totalCopies": 2,
                "imageUrl": "http://example.com/test.jpg",
                "authorName": "Test Author",
                "publisher": "Test Publisher"
            }
        """;

        mockMvc.perform(post("/api/items/librarian/add-item")
                .contentType("application/json")
                .content(bookJson))
            .andExpect(status().isOk())
            .andExpect(result -> result.getResponse().getContentAsString().contains("copies of the item added successfully"));
    }
}