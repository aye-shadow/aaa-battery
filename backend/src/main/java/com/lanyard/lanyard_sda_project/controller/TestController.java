package com.lanyard.lanyard_sda_project.controller;

import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/test")
public class TestController {

    @GetMapping("/get")
    public String sayHello() {
        return "Hello, World!";
    }

    @PostMapping("/post")
    public Map<String, String> handlePostRequest(@RequestBody Map<String, String> payload) {
        String input = payload.get("input");
        // Process the input value

        // Create a response map
        Map<String, String> response = new HashMap<>();
        response.put("message", "Server received input: " + input);

        return response;
    }
}