package com.aaa_battery.aaa_batteryproject.testclass.controller;

import com.aaa_battery.aaa_batteryproject.testclass.model.TestEntity;
import com.aaa_battery.aaa_batteryproject.testclass.repository.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private TestRepository inputDataRepository;

    @GetMapping("/get")
    public List<TestEntity> getAllEntries() {
        return inputDataRepository.findAll();
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