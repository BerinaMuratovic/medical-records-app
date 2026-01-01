FROM eclipse-temurin:21-jdk

WORKDIR /app


COPY backend/.mvn .mvn
COPY backend/mvnw mvnw
COPY backend/pom.xml pom.xml
COPY backend/src src

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/MedicalRecordsApp-0.0.1-SNAPSHOT.jar"]
