FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8070
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]
