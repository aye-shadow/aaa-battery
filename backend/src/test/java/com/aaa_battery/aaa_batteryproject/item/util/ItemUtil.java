package com.aaa_battery.aaa_batteryproject.item.util;

import java.util.stream.Stream;

public class ItemUtil {
    static String missingItemNameBase = """
        {
            "type": %s,
            "genre": %s,
            "blurb": %s,
            "date": %s,
            "totalCopies": %s,
            "imageUrl": %s
        }
        """;

    static String missingTypeBase = """
        {
            "itemName": %s,
            "genre": %s,
            "blurb": %s,
            "date": %s,
            "totalCopies": %s,
            "imageUrl": %s
        }
        """;
    
    static String missingGenreBase = """
        {
            "itemName": %s,
            "type": %s,
            "blurb": %s,
            "date": %s,
            "totalCopies": %s,
            "imageUrl": %s
        }
        """;
    
    static String missingBlurbBase = """
        {
            "itemName": %s,
            "type": %s,
            "genre": %s,
            "date": %s,
            "totalCopies": %s,
            "imageUrl": %s
        }
        """;

    static String missingDateBase = """
        {
            "itemName": %s,
            "type": %s,
            "genre": %s,
            "blurb": %s,
            "totalCopies": %s,
            "imageUrl": %s
        }
        """;

    static String missingTotalCopiesBase = """
        {
            "itemName": %s,
            "type": %s,
            "genre": %s,
            "blurb": %s,
            "date": %s,
            "imageUrl": %s
        }
        """;

    static String missingImageUrlBase = """
        {
            "itemName": %s,
            "type": %s,
            "genre": %s,
            "blurb": %s,
            "date": %s,
            "totalCopies": %s
        }
        """;

    private static String addBookFields(String json, String authorName, String publisher) {
        // Remove the last closing brace
        String trimmed = json.trim();
        if (trimmed.endsWith("}")) {
            trimmed = trimmed.substring(0, trimmed.length() - 1);
        }
        // Remove trailing comma if present
        if (trimmed.endsWith(",")) {
            trimmed = trimmed.substring(0, trimmed.length() - 1);
        }
        // Add the new fields and close the object
        return trimmed + String.format(",\n    \"authorName\": %s,\n    \"publisher\": %s\n}", authorName, publisher);
    }

    private static String addAudiobookFields(String json, String narrator, String duration) {
        String trimmed = json.trim();
        if (trimmed.endsWith("}")) {
            trimmed = trimmed.substring(0, trimmed.length() - 1);
        }
        if (trimmed.endsWith(",")) {
            trimmed = trimmed.substring(0, trimmed.length() - 1);
        }
        return trimmed + String.format(",\n    \"narrator\": %s,\n    \"duration\": %s\n}", narrator, duration);
    }

    private static String addDvdFields(String json, String producer, String director, String duration) {
        String trimmed = json.trim();
        if (trimmed.endsWith("}")) {
            trimmed = trimmed.substring(0, trimmed.length() - 1);
        }
        if (trimmed.endsWith(",")) {
            trimmed = trimmed.substring(0, trimmed.length() - 1);
        }
        return trimmed + String.format(",\n    \"producer\": %s,\n    \"director\": %s,\n    \"duration\": %s\n}", producer, director, duration);
    }

    public static Stream<String> commonDetails() {
        String base = """
            {
                "itemName": %s,
                "type": %s,
                "genre": %s,
                "blurb": %s,
                "date": %s,
                "totalCopies": %s,
                "imageUrl": %s
            }
            """;

            return Stream.of(
                // itemName
                base.formatted("", "\"book\"", "\"Fiction\"", "\"A test book blurb.\"", "\"2024-01-01T00:00:00\"", "2", "\"http://example.com/test.jpg\""),
                base.formatted("null", "\"book\"", "\"Fiction\"", "\"A test book blurb.\"", "\"2024-01-01T00:00:00\"", "2", "\"http://example.com/test.jpg\""),
                missingItemNameBase.formatted("\"book\"", "\"Fiction\"", "\"A test book blurb.\"", "\"2024-01-01T00:00:00\"", "2", "\"http://example.com/test.jpg\""),
                // type
                base.formatted("\"Test Book\"", "", "\"Fiction\"", "\"A test book blurb.\"", "\"2024-01-01T00:00:00\"", "2", "\"http://example.com/test.jpg\""),
                base.formatted("\"Test Book\"", "null", "\"Fiction\"", "\"A test book blurb.\"", "\"2024-01-01T00:00:00\"", "2", "\"http://example.com/test.jpg\""),
                missingTypeBase.formatted("\"Test Book\"", "\"Fiction\"", "\"A test book blurb.\"", "\"2024-01-01T00:00:00\"", "2", "\"http://example.com/test.jpg\""),
                // genre
                base.formatted("\"Test Book\"", "\"book\"", "", "\"A test book blurb.\"", "\"2024-01-01T00:00:00\"", "2", "\"http://example.com/test.jpg\""),
                base.formatted("\"Test Book\"", "\"book\"", "null", "\"A test book blurb.\"", "\"2024-01-01T00:00:00\"", "2", "\"http://example.com/test.jpg\""),
                missingGenreBase.formatted("\"Test Book\"", "\"book\"", "\"A test book blurb.\"", "\"2024-01-01T00:00:00\"", "2", "\"http://example.com/test.jpg\""),
                // blurb
                base.formatted("\"Test Book\"", "\"book\"", "\"Fiction\"", "", "\"2024-01-01T00:00:00\"", "2", "\"http://example.com/test.jpg\""),
                base.formatted("\"Test Book\"", "\"book\"", "\"Fiction\"", "null", "\"2024-01-01T00:00:00\"", "2", "\"http://example.com/test.jpg\""),
                missingBlurbBase.formatted("\"Test Book\"", "\"book\"", "\"Fiction\"", "\"2024-01-01T00:00:00\"", "2", "\"http://example.com/test.jpg\""),
                // date
                base.formatted("\"Test Book\"", "\"book\"", "\"Fiction\"", "\"A test book blurb.\"", "", "2", "\"http://example.com/test.jpg\""),
                base.formatted("\"Test Book\"", "\"book\"", "\"Fiction\"", "\"A test book blurb.\"", "null", "2", "\"http://example.com/test.jpg\""),
                missingDateBase.formatted("\"Test Book\"", "\"book\"", "\"Fiction\"", "\"A test book blurb.\"", "2", "\"http://example.com/test.jpg\""),
                // totalCopies
                base.formatted("\"Test Book\"", "\"book\"", "\"Fiction\"", "\"A test book blurb.\"", "\"2024-01-01T00:00:00\"", "", "\"http://example.com/test.jpg\""),
                base.formatted("\"Test Book\"", "\"book\"", "\"Fiction\"", "\"A test book blurb.\"", "\"2024-01-01T00:00:00\"", "null", "\"http://example.com/test.jpg\""),
                missingTotalCopiesBase.formatted("\"Test Book\"", "\"book\"", "\"Fiction\"", "\"A test book blurb.\"", "\"2024-01-01T00:00:00\"", "\"http://example.com/test.jpg\""),
                // imageUrl
                base.formatted("\"Test Book\"", "\"book\"", "\"Fiction\"", "\"A test book blurb.\"", "\"2024-01-01T00:00:00\"", "2", ""),
                base.formatted("\"Test Book\"", "\"book\"", "\"Fiction\"", "\"A test book blurb.\"", "\"2024-01-01T00:00:00\"", "2", "null"),
                missingImageUrlBase.formatted("\"Test Book\"", "\"book\"", "\"Fiction\"", "\"A test book blurb.\"", "\"2024-01-01T00:00:00\"", "2")
            );
    }
    
    public static Stream<String> invalidBookJsonProvider() {
        String base = """
            {
                "authorName": %s,
                "publisher": %s
            }
            """;

        String missingAuthorNameBase = """
            {
                "itemName": %s,
                "type": %s,
                "genre": %s,
                "blurb": %s,
                "date": %s,
                "totalCopies": %s,
                "imageUrl": %s,
                "publisher": %s
            }
            """;
        
        String missingPublisherBase = """
            {
                "itemName": %s,
                "type": %s,
                "genre": %s,
                "blurb": %s,
                "date": %s,
                "totalCopies": %s,
                "imageUrl": %s,
                "authorName": %s
            }
            """;
        
            Stream<String> commonDetails = commonDetails()
                .map(json -> addBookFields(json, "\"Test Author\"", "\"Test Publisher\""));
        
        Stream<String> extraCases = Stream.of (
            // authorName
            base.formatted("\"Test Book\"", "\"book\"", "\"Fiction\"", "\"A test book blurb.\"", "\"2024-01-01T00:00:00\"", "2", "\"http://example.com/test.jpg\"", "", "\"Test Publisher\""),
            base.formatted("\"Test Book\"", "\"book\"", "\"Fiction\"", "\"A test book blurb.\"", "\"2024-01-01T00:00:00\"", "2", "\"http://example.com/test.jpg\"", "null", "\"Test Publisher\""),
            missingAuthorNameBase.formatted("\"Test Book\"", "\"book\"", "\"Fiction\"", "\"A test book blurb.\"", "\"2024-01-01T00:00:00\"", "2", "\"http://example.com/test.jpg\"", "\"Test Publisher\""),
            // publisher
            base.formatted("\"Test Book\"", "\"book\"", "\"Fiction\"", "\"A test book blurb.\"", "\"2024-01-01T00:00:00\"", "2", "\"http://example.com/test.jpg\"", "\"Test Author\"", ""),
            base.formatted("\"Test Book\"", "\"book\"", "\"Fiction\"", "\"A test book blurb.\"", "\"2024-01-01T00:00:00\"", "2", "\"http://example.com/test.jpg\"", "\"Test Author\"", "null"),
            missingPublisherBase.formatted("\"Test Book\"", "\"book\"", "\"Fiction\"", "\"A test book blurb.\"", "\"2024-01-01T00:00:00\"", "2", "\"http://example.com/test.jpg\"", "\"Test Author\"")
        );

        return Stream.concat(commonDetails, extraCases);
    }

    public static Stream<String> invalidAudiobookJsonProvider() {
        String base = """
            {
                "narrator": %s,
                "duration": %s
            }
            """;
    
        String missingNarratorBase = """
            {
                "itemName": %s,
                "type": %s,
                "genre": %s,
                "blurb": %s,
                "date": %s,
                "totalCopies": %s,
                "imageUrl": %s,
                "authorName": %s,
                "publisher": %s,
                "duration": %s
            }
            """;
    
        String missingDurationBase = """
            {
                "itemName": %s,
                "type": %s,
                "genre": %s,
                "blurb": %s,
                "date": %s,
                "totalCopies": %s,
                "imageUrl": %s,
                "authorName": %s,
                "publisher": %s,
                "narrator": %s
            }
            """;
    
        Stream<String> commonDetails = commonDetails()
            .map(json -> addBookFields(json, "\"Audio Author\"", "\"Audio Publisher\""))
            .map(json -> addAudiobookFields(json, "\"Test Narrator\"", "\"01:30:00\""));
    
        Stream<String> extraCases = Stream.of(
            // narrator
            base.formatted("", "\"01:30:00\""),
            base.formatted("null", "\"01:30:00\""),
            missingNarratorBase.formatted("\"Test Audiobook\"", "\"audiobook\"", "\"Nonfiction\"", "\"A test audiobook blurb.\"", "\"2024-02-01T00:00:00\"", "3", "\"http://example.com/audiobook.jpg\"", "\"Audio Author\"", "\"Audio Publisher\"", "\"01:30:00\""),
            // duration
            base.formatted("\"Test Narrator\"", ""),
            base.formatted("\"Test Narrator\"", "null"),
            missingDurationBase.formatted("\"Test Audiobook\"", "\"audiobook\"", "\"Nonfiction\"", "\"A test audiobook blurb.\"", "\"2024-02-01T00:00:00\"", "3", "\"http://example.com/audiobook.jpg\"", "\"Audio Author\"", "\"Audio Publisher\"", "\"Test Narrator\"")
        );
    
        return Stream.concat(commonDetails, extraCases);
    }

    public static Stream<String> invalidDvdJsonProvider() {
        String base = """
            {
                "producer": %s,
                "director": %s,
                "duration": %s
            }
            """;
    
        String missingProducerBase = """
            {
                "itemName": %s,
                "type": %s,
                "genre": %s,
                "blurb": %s,
                "date": %s,
                "totalCopies": %s,
                "imageUrl": %s,
                "director": %s,
                "duration": %s
            }
            """;
    
        String missingDirectorBase = """
            {
                "itemName": %s,
                "type": %s,
                "genre": %s,
                "blurb": %s,
                "date": %s,
                "totalCopies": %s,
                "imageUrl": %s,
                "producer": %s,
                "duration": %s
            }
            """;
    
        String missingDurationBase = """
            {
                "itemName": %s,
                "type": %s,
                "genre": %s,
                "blurb": %s,
                "date": %s,
                "totalCopies": %s,
                "imageUrl": %s,
                "producer": %s,
                "director": %s
            }
            """;
    
        Stream<String> commonDetails = commonDetails()
            .map(json -> addDvdFields(json, "\"Test Producer\"", "\"Test Director\"", "\"02:00:00\""));
    
        Stream<String> extraCases = Stream.of(
            // producer
            base.formatted("", "\"Test Director\"", "\"02:00:00\""),
            base.formatted("null", "\"Test Director\"", "\"02:00:00\""),
            missingProducerBase.formatted("\"Test DVD\"", "\"dvd\"", "\"Action\"", "\"A test DVD blurb.\"", "\"2024-03-01T00:00:00\"", "4", "\"http://example.com/dvd.jpg\"", "\"Test Director\"", "\"02:00:00\""),
            // director
            base.formatted("\"Test Producer\"", "", "\"02:00:00\""),
            base.formatted("\"Test Producer\"", "null", "\"02:00:00\""),
            missingDirectorBase.formatted("\"Test DVD\"", "\"dvd\"", "\"Action\"", "\"A test DVD blurb.\"", "\"2024-03-01T00:00:00\"", "4", "\"http://example.com/dvd.jpg\"", "\"Test Producer\"", "\"02:00:00\""),
            // duration
            base.formatted("\"Test Producer\"", "\"Test Director\"", ""),
            base.formatted("\"Test Producer\"", "\"Test Director\"", "null"),
            missingDurationBase.formatted("\"Test DVD\"", "\"dvd\"", "\"Action\"", "\"A test DVD blurb.\"", "\"2024-03-01T00:00:00\"", "4", "\"http://example.com/dvd.jpg\"", "\"Test Producer\"", "\"Test Director\"")
        );
    
        return Stream.concat(commonDetails, extraCases);
    }
}
