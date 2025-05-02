Stream<String> commonDetails = commonDetails()
        .map(json -> addBookFields(json, "\"Test Author\"", "\"Test Publisher\""));