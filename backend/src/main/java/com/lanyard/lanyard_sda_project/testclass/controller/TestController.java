package com.lanyard.lanyard_sda_project.testclass.controller;

import com.lanyard.lanyard_sda_project.testclass.model.TestEntity;
import com.lanyard.lanyard_sda_project.testclass.repository.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    private TestRepository inputDataRepository;

    @GetMapping("/get")
    public String sayHello() {
        return "Hello, World!";
    }

    @PostMapping("/post")
    public Map<String, String> handlePostRequest(@RequestBody Map<String, String> payload) {
        String input = payload.get("input");

        // Save input to the database
        TestEntity inputData = new TestEntity();
        inputData.setInput(input);
        inputDataRepository.save(inputData);

        // Create a response map
        Map<String, String> response = new HashMap<>();
        response.put("message", "Server received input: " + input);

        return response;
    }
}