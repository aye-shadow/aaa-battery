#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  set -o allexport
  source .env
  set +o allexport
fi

# Run Maven clean package
mvn clean package
SPRING_PROFILES_ACTIVE=local java -jar target/lanyard-sda-project-0.0.1-SNAPSHOT.jar
