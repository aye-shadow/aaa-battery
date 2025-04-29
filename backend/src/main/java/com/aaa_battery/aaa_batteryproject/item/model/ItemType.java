package com.aaa_battery.aaa_batteryproject.item.model;

public enum ItemType {
    BOOK,
    AUDIOBOOK,
    DVD;

    public boolean equalsIgnoreCase(String string) {
        if (string == null) {
            return false;
        }
        return this.name().equalsIgnoreCase(string);
    }

    public static boolean isValidType(String type) {
        if (type == null || type.isBlank()) {
            return false;
        }
        try {
            ItemType.valueOf(type.trim().toUpperCase());
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}
