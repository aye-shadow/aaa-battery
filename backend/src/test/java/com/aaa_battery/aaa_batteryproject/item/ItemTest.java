package com.aaa_battery.aaa_batteryproject.item;

import com.aaa_battery.aaa_batteryproject.item.repository.ItemRepository;
import com.aaa_battery.aaa_batteryproject.item.service.ItemService;
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

    @Autowired
    private ItemService itemService;

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
    
    @Test
    @WithMockUser(username = "i220899@nu.edu.pk", roles = {"LIBRARIAN"})
    void testEditItemSuccess() throws Exception {
        // First add a book
        testLoginLibrarianAndAddBook();
        
        // Get the descriptionId of the added book
        var allItems = itemRepository.findAll();
        assert !allItems.isEmpty();
        Integer descriptionId = allItems.get(0).getDescription().getDescriptionId();
        
        // Prepare edit data
        String editJson = """
            {
                "descriptionId": %d,
                "itemName": "Updated Book Title",
                "genre": "Science Fiction",
                "blurb": "Updated blurb text",
                "imageUrl": "http://example.com/updated.jpg",
                "authorName": "Updated Author",
                "publisher": "Updated Publisher"
            }
        """.formatted(descriptionId);
        
        // Perform the edit
        mockMvc.perform(
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                    .put("/api/items/librarian/edit-item")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(editJson)
            )
            .andExpect(status().isOk())
            .andExpect(result -> {
                String response = result.getResponse().getContentAsString();
                assert response.contains("Item updated successfully");
            });
        
        // Verify the changes by getting the item
        mockMvc.perform(
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                    .get("/api/items/users/view-item")
                    .param("descriptionId", descriptionId.toString())
            )
            .andExpect(status().isOk())
            .andExpect(result -> {
                String json = result.getResponse().getContentAsString();
                assert json.contains("Updated Book Title");
                assert json.contains("Science Fiction");
                assert json.contains("Updated blurb text");
            });
    }

    @Test
    @WithMockUser(username = "i220899@nu.edu.pk", roles = {"LIBRARIAN"})
    void testEditItemIncreaseCopies() throws Exception {
        // Clear any existing items to ensure a clean state
        itemRepository.deleteAll();
        
        // Add a new book with 2 copies
        testLoginLibrarianAndAddBook();
        
        // Get the descriptionId
        var allItems = itemRepository.findAll();
        assert !allItems.isEmpty() : "No items found after adding book";
        Integer descriptionId = allItems.get(0).getDescription().getDescriptionId();
        
        // Get current number of copies
        int initialCopies = itemService.getItemsByDescriptionId(descriptionId).size();
        assert initialCopies == 2 : "Expected 2 initial copies, but got " + initialCopies;
        
        // Prepare edit data to increase copies to 5
        String editJson = String.format("""
            {
                "descriptionId": %d,
                "totalCopies": 5
            }""", descriptionId);
        
        // Perform the edit
        mockMvc.perform(
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                    .put("/api/items/librarian/edit-item")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(editJson)
            )
            .andExpect(status().isOk())
            .andExpect(result -> {
                String responseBody = result.getResponse().getContentAsString();
                assert responseBody.contains("Item updated successfully") : 
                       "Expected success message, but got: " + responseBody;
            });
        
        // Verify the increase in copies
        int updatedCopies = itemService.getItemsByDescriptionId(descriptionId).size();
        assert updatedCopies == 5 : "Expected 5 copies after update, but got " + updatedCopies;
        assert updatedCopies > initialCopies : "Copy count did not increase";
    }
    
    @Test
    @WithMockUser(username = "i220899@nu.edu.pk", roles = {"LIBRARIAN"})
    void testEditItemDecreaseCopies() throws Exception {
        // First add a book with 2 copies
        testLoginLibrarianAndAddBook();
        
        // Get the descriptionId
        var allItems = itemRepository.findAll();
        Integer descriptionId = allItems.get(0).getDescription().getDescriptionId();
        
        // Prepare edit data to decrease copies to 1
        String editJson = """
            {
                "descriptionId": %d,
                "totalCopies": 1
            }
        """.formatted(descriptionId);
        
        // Perform the edit
        mockMvc.perform(
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                    .put("/api/items/librarian/edit-item")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(editJson)
            )
            .andExpect(status().isOk());
        
        // Verify the decrease in copies
        int updatedCopies = itemService.getItemsByDescriptionId(descriptionId).size();
        assert updatedCopies == 1;
    }

    @Test
    @WithMockUser(username = "i220899@nu.edu.pk", roles = {"LIBRARIAN"})
    void testEditItemMissingDescriptionId() throws Exception {
        String editJson = """
            {
                "itemName": "Updated Book Title",
                "genre": "Science Fiction"
            }
        """;
        
        mockMvc.perform(
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                    .put("/api/items/librarian/edit-item")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(editJson)
            )
            .andExpect(status().isBadRequest())
            .andExpect(result -> {
                String response = result.getResponse().getContentAsString();
                assert response.contains("Missing required field: descriptionId");
            });
    }

    @Test
    @WithMockUser(username = "i220899@nu.edu.pk", roles = {"LIBRARIAN"})
    void testEditNonExistentItem() throws Exception {
        String editJson = """
            {
                "descriptionId": 99999,
                "itemName": "This Should Fail",
                "genre": "Error"
            }
        """;
        
        mockMvc.perform(
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                    .put("/api/items/librarian/edit-item")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(editJson)
            )
            .andExpect(status().isNotFound())
            .andExpect(result -> {
                String response = result.getResponse().getContentAsString();
                assert response.contains("Item description not found");
            });
    }

    @Test
    @WithMockUser(username = "student@nu.edu.pk", roles = {"BORROWER"})
    void testNonLibrarianCannotEditItem() throws Exception {
        // First add a book as a librarian
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
                .with(user("i220899@nu.edu.pk").roles("LIBRARIAN"))
                .contentType("application/json")
                .content(bookJson))
            .andExpect(status().isOk());
        
        // Get the descriptionId
        var allItems = itemRepository.findAll();
        Integer descriptionId = allItems.get(0).getDescription().getDescriptionId();
        
        // Try to edit as borrower
        String editJson = """
            {
                "descriptionId": %d,
                "itemName": "Unauthorized Edit"
            }
        """.formatted(descriptionId);
        
        mockMvc.perform(
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                    .put("/api/items/librarian/edit-item")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(editJson)
            )
            .andExpect(status().isForbidden());
    }
}