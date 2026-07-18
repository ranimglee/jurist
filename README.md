# Jurist

Full-stack legal administration platform with a React/Vite frontend, a Spring Boot backend, and MySQL.

## Prerequisites

- Docker Desktop or Docker Engine with Docker Compose v2
- Git
- A `.env` file based on `.env.example`

## Docker Installation

Install Docker Desktop from:

```text
https://www.docker.com/products/docker-desktop/
```

After installation, verify Docker Compose is available:

```sh
docker compose version
```

## Environment Setup

Copy the example environment file:

```sh
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Edit `.env` and replace all placeholder secrets, especially:

- `MYSQL_PASSWORD`
- `MYSQL_ROOT_PASSWORD`
- `JWT_SECRET`
- `APP_ADMIN_PASSWORD`
- `MAIL_USERNAME`
- `MAIL_PASSWORD`

## Build and Start

From the repository root:

```sh
docker compose up --build
```

The application will be available at:

```text
http://localhost:3000
```

The frontend nginx container proxies API traffic to the backend service with Docker networking:

```text
frontend nginx -> http://backend:8080
backend -> jdbc:mysql://mysql:3306/juristdb
```

## Stop

```sh
docker compose down
```

To stop and remove the MySQL volume too:

```sh
docker compose down -v
```

## Rebuild

Rebuild all services:

```sh
docker compose up --build
```

Rebuild without cache:

```sh
docker compose build --no-cache
docker compose up
```

## Logs

View all logs:

```sh
docker compose logs
```

Follow all logs:

```sh
docker compose logs -f
```

View one service:

```sh
docker compose logs backend
docker compose logs frontend
docker compose logs mysql
```

## Services

- `mysql`: MySQL 8 database with persistent named volume `jurist_mysql_data`.
- `backend`: Spring Boot 3.4 API on internal port `8080`.
- `frontend`: nginx serving the Vite production build on `localhost:3000`.

## Useful Commands

Open a shell in the backend container:

```sh
docker compose exec backend sh
```

Open MySQL:

```sh
docker compose exec mysql mysql -u root -p
```

List containers:

```sh
docker compose ps
```

## Notes

- Do not use `localhost` between containers. Compose services communicate through service names: `mysql`, `backend`, and `frontend`.
- Keep `VITE_API_BASE_URL` empty for the default Docker setup. Browser requests go to the same frontend origin and nginx proxies `/api`, `/auth`, and `/ws` to the backend.
- Set `APP_COOKIE_SECURE=true` only when serving the app over HTTPS.

