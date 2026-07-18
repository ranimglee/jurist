# Jurist Backend

Spring Boot backend for Jurist, a legal administration platform used to manage lawyers, legal cases, judicial aid requests, assignment workflows, admin dashboards, exports, authentication, and notifications.

## Features

- JWT-based authentication with secure HTTP-only cookies.
- Admin login, logout, current-user lookup, password reset, and password change.
- Lawyer management with create, list, update, delete, PDF export, and Excel export.
- Legal case management with CRUD operations and lawyer assignment flows.
- Judicial aid request management with eligible-lawyer selection and reassignment.
- Dashboard statistics for lawyers, cases, workloads, trends, response rates, and regional distribution.
- Email notifications for password reset and case assignment workflows.
- WebSocket notifications through STOMP/SockJS.
- PDF generation with Thymeleaf templates and RTL/Arabic font support.
- Swagger/OpenAPI documentation.

## Tech Stack

- Java 21
- Spring Boot 3.4
- Spring Web
- Spring Security
- Spring Data JPA / Hibernate
- MySQL
- Maven
- Lombok
- Java Mail
- JJWT
- Spring WebSocket
- Thymeleaf
- OpenHTMLToPDF, OpenPDF, Apache POI, ICU4J
- Springdoc OpenAPI

## Requirements

- Java 21
- Maven 3.9 or the included Maven wrapper
- MySQL server
- SMTP credentials for email features

## Configuration

Main configuration is in:

```text
src/main/resources/application.properties
```

The application currently uses:

```properties
server.port=${SERVER_PORT:8080}
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:mysql://localhost:3306/juristdb?createDatabaseIfNotExist=true}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME:root}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:}
spring.jpa.hibernate.ddl-auto=update
```

Create a `.env` file in the project root for mail credentials:

```env
MAIL_USERNAME=your_email@example.com
MAIL_PASSWORD=your_app_password
```

The app loads these values at startup and maps them to Spring mail properties.

For production, replace the default values for:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`
- `APP_ADMIN_EMAIL`
- `APP_ADMIN_PASSWORD`
- SMTP credentials

## Getting Started

Start MySQL and make sure the configured user can create or access the `juristdb` database.

Run the application with the Maven wrapper:

```sh
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

Or with a local Maven installation:

```sh
mvn spring-boot:run
```

The API will be available at:

```text
http://localhost:8080
```

Swagger UI will be available at:

```text
http://localhost:8080/swagger-ui/index.html
```

## Testing

Run the test suite:

```sh
./mvnw test
```

On Windows PowerShell:

```powershell
.\mvnw.cmd test
```

## Build

Create a production jar:

```sh
./mvnw clean package
```

The jar is generated in:

```text
target/
```

## Docker

The project includes a multi-stage Dockerfile:

- Builder: `maven:3.9.9-eclipse-temurin-21`
- Runtime: `eclipse-temurin:21-jre-alpine`

Build the Docker image:

```sh
docker build -t jurist-backend .
```

Run the container:

```sh
docker run -p 8080:8080 --env-file .env jurist-backend
```

When using Docker, make sure the configured database host is reachable from the container.

In the full Docker Compose setup, run from the repository root:

```sh
docker compose up --build
```

The backend receives these environment variables:

```text
SERVER_PORT=8080
SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/juristdb
SPRING_DATASOURCE_USERNAME=...
SPRING_DATASOURCE_PASSWORD=...
JWT_SECRET=...
MAIL_USERNAME=...
MAIL_PASSWORD=...
```

## Main API Areas

- `POST /auth/login` - login and set JWT cookie
- `POST /auth/logout` - clear JWT cookie
- `GET /auth/me` - current authenticated user
- `POST /auth/forgot-password` - send password reset email
- `POST /auth/reset-password` - reset password
- `POST /auth/change-password` - change authenticated user password
- `/api/lawyers/**` - lawyer CRUD and exports
- `/api/affaires/**` - legal case CRUD and assignment actions
- `/api/aides-judiciaires/**` - judicial aid CRUD and assignment
- `/api/dashboard/**` - dashboard statistics
- `/api/notifications/**` - admin notifications
- `/ws` - WebSocket endpoint

See Swagger UI for the full request and response contracts.

## Project Structure

```text
src/main/java/com/onat/jurist/lawyer/
  config/          CORS, Swagger, and WebSocket configuration
  controller/      REST API controllers
  dto/             Request and response objects
  entity/          JPA entities and enums
  exception/       Custom exceptions and global handler
  repository/      Spring Data repositories
  security/        JWT filter, utilities, and Spring Security config
  service/         Business logic

src/main/resources/
  application.properties
  templates/       HTML templates for generated documents/emails
  fonts/           Arabic/RTL font assets
  images/          PDF/export image assets
```

## Frontend Integration

The React frontend should point to this backend with:

```env
VITE_API_BASE_URL=http://localhost:8080
```

CORS currently allows these frontend origins:

- `http://localhost:8081`
- `http://localhost:3000`
- `https://lawyers-j1tr.onrender.com`
- `https://onanabeul.netlify.app`

If the frontend runs on another origin, add it in `CorsConfig` and `WebSocketConfig`.

## Security Notes

- Change the default JWT secret before deploying.
- Change the default admin email and password before deploying.
- Do not commit real `.env` values or SMTP app passwords.
- Review `SecurityConfig` before production use, because several API routes are currently permitted at the Spring Security layer and some controllers perform their own cookie checks.
