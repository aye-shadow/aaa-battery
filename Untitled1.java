@ParameterizedTest
@MethodSource("com.aaa_battery.aaa_batteryproject.item.util.ItemUtil#invalidAudiobookJsonProvider")
@WithMockUser(username = "i220899@nu.edu.pk", roles = {"LIBRARIAN"})
void testAddAudiobookWithInvalidFields(String invalidJson) throws Exception {
    mockMvc.perform(post("/api/items/librarian/add-item")
            .contentType(MediaType.APPLICATION_JSON)
            .content(invalidJson))
        .andExpect(status().isBadRequest());
}