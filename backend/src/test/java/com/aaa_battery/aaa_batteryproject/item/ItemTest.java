package com.aaa_battery.aaa_batteryproject.item;

import com.aaa_battery.aaa_batteryproject.item.repository.ItemRepository;
import com.aaa_battery.aaa_batteryproject.item.util.ItemUtil;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
public class ItemTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ItemRepository itemRepository;

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

    @Test
    @WithMockUser(username = "i220899@nu.edu.pk", roles = {"LIBRARIAN"})
    void testLoginLibrarianAndAddAudiobook() throws Exception {
        String audiobookJson = """
            {
                "itemName": "Test Audiobook",
                "type": "audiobook",
                "genre": "Nonfiction",
                "blurb": "A test audiobook blurb.",
                "date": "2024-02-01T00:00:00",
                "totalCopies": 3,
                "imageUrl": "http://example.com/audiobook.jpg",
                "authorName": "Audio Author",
                "publisher": "Audio Publisher",
                "narrator": "Test Narrator",
                "duration": "01:30:00"
            }
        """;

        mockMvc.perform(post("/api/items/librarian/add-item")
                .contentType("application/json")
                .content(audiobookJson))
            .andExpect(status().isOk())
            .andExpect(result -> result.getResponse().getContentAsString().contains("copies of the item added successfully"));
    }

    @Test
    @WithMockUser(username = "i220899@nu.edu.pk", roles = {"LIBRARIAN"})
    void testLoginLibrarianAndAddDVD() throws Exception {
        String dvdJson = """
            {
                "itemName": "Test DVD",
                "type": "dvd",
                "genre": "Action",
                "blurb": "A test DVD blurb.",
                "date": "2024-03-01T00:00:00",
                "totalCopies": 4,
                "imageUrl": "http://example.com/dvd.jpg",
                "producer": "Test Producer",
                "director": "Test Director",
                "duration": "02:00:00"
            }
        """;

        mockMvc.perform(post("/api/items/librarian/add-item")
                .contentType("application/json")
                .content(dvdJson))
            .andExpect(status().isOk())
            .andExpect(result -> result.getResponse().getContentAsString().contains("copies of the item added successfully"));
    }

    @ParameterizedTest
    @MethodSource("com.aaa_battery.aaa_batteryproject.item.util.ItemUtil#invalidBookJsonProvider")
    @WithMockUser(username = "i220899@nu.edu.pk", roles = {"LIBRARIAN"})
    void testAddBookWithInvalidFields(String invalidJson) throws Exception {
        mockMvc.perform(post("/api/items/librarian/add-item")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidJson))
            .andExpect(status().isBadRequest());
    }

    @ParameterizedTest
    @MethodSource("com.aaa_battery.aaa_batteryproject.item.util.ItemUtil#invalidAudiobookJsonProvider")
    @WithMockUser(username = "i220899@nu.edu.pk", roles = {"LIBRARIAN"})
    void testAddAudiobookWithInvalidFields(String invalidJson) throws Exception {
        mockMvc.perform(post("/api/items/librarian/add-item")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidJson))
            .andExpect(status().isBadRequest());
    }

    @ParameterizedTest
    @MethodSource("com.aaa_battery.aaa_batteryproject.item.util.ItemUtil#invalidDvdJsonProvider")
    @WithMockUser(username = "i220899@nu.edu.pk", roles = {"LIBRARIAN"})
    void testAddDvdWithInvalidFields(String invalidJson) throws Exception {
        mockMvc.perform(post("/api/items/librarian/add-item")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidJson))
            .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "student@nu.edu.pk", roles = {"BORROWER"})
    void testNonLibrarianCannotAddBook() throws Exception {
        String bookJson = """
            {
                "itemName": "Unauthorized Book",
                "type": "book",
                "genre": "Fiction",
                "blurb": "Should not be added.",
                "date": "2024-01-01T00:00:00",
                "totalCopies": 1,
                "imageUrl": "http://example.com/unauth.jpg",
                "authorName": "Unauthorized Author",
                "publisher": "Unauthorized Publisher"
            }
        """;

        mockMvc.perform(post("/api/items/librarian/add-item")
                .contentType(MediaType.APPLICATION_JSON)
                .content(bookJson))
            .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "i220899@nu.edu.pk", roles = {"LIBRARIAN"})
    void testViewItemsReturnsCorrectStructure() throws Exception {
        testLoginLibrarianAndAddBook(); // Add a book
        testLoginLibrarianAndAddAudiobook(); // Add an audiobook
        testLoginLibrarianAndAddDVD(); // Add a DVD

        // Now test the view-items endpoint
        mockMvc.perform(
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/items/users/view-items")
            )
            .andExpect(status().isOk())
            .andExpect(result -> {
                String json = result.getResponse().getContentAsString();
                // Should contain both book and dvd
                assert json.contains("Test Book");
                assert json.contains("Test DVD");
                // Should contain totalCopies and availableCopies
                assert json.contains("totalCopies");
                assert json.contains("availableCopies");
                // Should contain description fields
                assert json.contains("descriptionId");
                assert json.contains("itemName");
                assert json.contains("type");
                assert json.contains("genre");
                assert json.contains("blurb");
                assert json.contains("imageUrl");
            });
    }

    @Test
    @WithMockUser(username = "i220899@nu.edu.pk", roles = {"LIBRARIAN"})
    void testViewItemsEmptyList() throws Exception {
        itemRepository.deleteAll();
        mockMvc.perform(
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/items/users/view-items")
            )
            .andExpect(status().isOk())
            .andExpect(result -> {
                String json = result.getResponse().getContentAsString();
                assert json.equals("[]");
            });
    }

    @Test
    @WithMockUser(username = "student@nu.edu.pk", roles = {"BORROWER"})
    void testBorrowerCanViewItems() throws Exception {
        mockMvc.perform(
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/items/users/view-items")
            )
            .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "i220899@nu.edu.pk", roles = {"LIBRARIAN"})
    void testViewItemByDescriptionIdReturnsCorrectItems() throws Exception {
        testLoginLibrarianAndAddBook();

        // Get the descriptionId of the added book
        var allItems = itemRepository.findAll();
        assert !allItems.isEmpty();
        Integer descriptionId = allItems.get(0).getDescription().getDescriptionId();

        // Call the endpoint with the descriptionId
        mockMvc.perform(
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                    .get("/api/items/users/view-item")
                    .param("descriptionId", descriptionId.toString())
            )
            .andExpect(status().isOk())
            .andExpect(result -> {
                String json = result.getResponse().getContentAsString();
                assert json.startsWith("[");
                assert json.contains("Test Book");
                assert json.contains(descriptionId.toString());
            });
    }

    @Test
    @WithMockUser(username = "student@nu.edu.pk", roles = {"BORROWER"})
    void testBorrowerCanViewItemByDescriptionId() throws Exception {
        // First add a book as a librarian (need to manually set authentication)
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
        
        // Use MockMvc's with() to temporarily set a librarian user for the add operation
        mockMvc.perform(post("/api/items/librarian/add-item")
                .with(user("i220899@nu.edu.pk").roles("LIBRARIAN"))
                .contentType("application/json")
                .content(bookJson))
            .andExpect(status().isOk());
        
        // Now test as borrower (uses the @WithMockUser from the method annotation)
        var allItems = itemRepository.findAll();
        Integer descriptionId = allItems.get(0).getDescription().getDescriptionId();

        mockMvc.perform(
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                    .get("/api/items/users/view-item")
                    .param("descriptionId", descriptionId.toString())
            )
            .andExpect(status().isOk())
            .andExpect(result -> {
                String json = result.getResponse().getContentAsString();
                assert json.contains("Test Book");
            });
    }

    @Test
    @WithMockUser(username = "i220899@nu.edu.pk", roles = {"LIBRARIAN"})
    void testViewItemByDescriptionIdReturnsEmptyListForNonexistentId() throws Exception {
        mockMvc.perform(
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                    .get("/api/items/users/view-item")
                    .param("descriptionId", "999999")
            )
            .andExpect(status().isOk())
            .andExpect(result -> {
                String json = result.getResponse().getContentAsString();
                assert json.equals("[]");
            });
    }

    @Test
    @WithMockUser(username = "i220899@nu.edu.pk", roles = {"LIBRARIAN"})
    void testViewItemByDescriptionIdMissingParamReturnsBadRequest() throws Exception {
        mockMvc.perform(
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                    .get("/api/items/users/view-item")
            )
            .andExpect(status().isBadRequest());
    }
}