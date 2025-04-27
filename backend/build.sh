#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  set -o allexport
  source .env
  set +o allexport
fi

# Set the Spring profile
export SPRING_PROFILES_ACTIVE=local

# Run Maven tests
mvn test

# Run Maven spring-boot:run
mvn spring-boot:run