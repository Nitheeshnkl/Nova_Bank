# Base image
FROM openjdk:18

# Working directory
WORKDIR /app

COPY target/ /app/

CMD ["java", "-jar", "nova-bank-platform-api-0.0.1-SNAPSHOT.jar"]
