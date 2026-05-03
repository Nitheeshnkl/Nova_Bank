FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# IMPORTANT: point to correct backend folder
COPY Backend/pom.xml .
COPY Backend/src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8070

ENTRYPOINT ["java", "-jar", "app.jar"]
