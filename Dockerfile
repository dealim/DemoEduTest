# Use the official Gradle image with JDK 8
FROM gradle:8-jdk AS build

# Set the working directory to '/app'
WORKDIR /app

# Copy the gradlew and gradle folder to the docker image
COPY gradlew .
COPY gradle ./gradle

# Grant execute permission for 'gradlew'
RUN chmod +x ./gradlew

# Copy build file and source code
COPY build.gradle .
COPY src ./src

# Build the application
RUN ./gradlew bootJar

# Use adoptopenjdk for base image with JDK 8
FROM adoptopenjdk:8-jre-hotspot

# 컨테이너 내부에서 접속하는 포트 설정
EXPOSE 8089

# Copy build application to 'app' folder in image
COPY --from=build /app/build/libs/*.jar /app/app.jar

# Run the application
CMD ["java", "-jar", "/app/app.jar"]

