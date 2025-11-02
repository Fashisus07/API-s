# Dockerfile for Spring Boot Backend
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY . /app
RUN mvn package -DskipTests

FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/backend-1.0.0.jar ./backend.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "backend.jar"]
