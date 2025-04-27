package com.aaa_battery.aaa_batteryproject.exceptions;

import org.springframework.http.HttpStatus;

public class HttpException extends RuntimeException {
    private final String errorCode;
    private final HttpStatus status;

    public HttpException(String message, String errorCode, HttpStatus status) {
        super(message);
        this.errorCode = errorCode;
        this.status = status;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
