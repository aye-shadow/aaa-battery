package com.aaa_battery.aaa_batteryproject.security.error_handler.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.NoHandlerFoundException;

import com.aaa_battery.aaa_batteryproject.security.error_handler.model.APIErrorResponse;

@ControllerAdvice
public class APIExceptionHandler {

    @ExceptionHandler({NoHandlerFoundException.class})
    public ResponseEntity<APIErrorResponse> handleNoHandlerFoundException(
            NoHandlerFoundException ex, HttpServletRequest httpServletRequest) {
        APIErrorResponse apiErrorResponse = new APIErrorResponse(404, "Resource not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).contentType(MediaType.APPLICATION_JSON).body(apiErrorResponse);
    }
}

