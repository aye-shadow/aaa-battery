#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  set -o allexport
  source .env
  set +o allexport
fi

# Run Maven tests
mvn clean test
if [ $? -ne 0 ]; then
  echo "Tests failed. Aborting."
  exit 1
fi

# Generate JaCoCo report
mvn jacoco:report

# Set the Spring profile
# export SPRING_PROFILES_ACTIVE=local

# Run Maven spring-boot:run
# mvn spring-boot:run