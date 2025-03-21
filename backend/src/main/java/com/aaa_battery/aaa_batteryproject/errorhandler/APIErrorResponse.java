package com.aaa_battery.aaa_batteryproject.errorhandler;

public class APIErrorResponse {

    private int code;
    private String message;

    public APIErrorResponse(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public int getCode() {
        return code;
    }
}


