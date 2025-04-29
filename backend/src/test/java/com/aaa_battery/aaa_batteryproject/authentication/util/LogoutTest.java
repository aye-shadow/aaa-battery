package com.aaa_battery.aaa_batteryproject.authentication.util;

import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class LogoutTest {
    public static void logoutUser(MockMvc mockMvc, String jwtString) throws Exception {
        mockMvc.perform(post("/api/auth/logout")
                .cookie(new jakarta.servlet.http.Cookie("jwt", jwtString)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value("User logged out successfully"))
                .andExpect(cookie().maxAge("jwt", 0));
    }

    public static void logoutNoone(MockMvc mockMvc) throws Exception {
        mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$").value("No cookies found in the request; no user logged in"));
    }
}
