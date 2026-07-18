# Juris Assist UI

React frontend for Jurist, a legal administration platform for managing lawyers, legal cases, judicial aid requests, dashboards, authentication, exports, and real-time notifications.

## Features

- Secure login, logout, password reset, and password change flows.
- Protected admin pages for dashboard, lawyers, cases, and judicial aid.
- Lawyer management with create, update, details, delete, PDF export, and Excel export workflows.
- Case management with assignment, status tracking, PDF generation, and signature support.
- Judicial aid management with eligible-lawyer assignment.
- Dashboard charts and operational statistics.
- Real-time notifications through SockJS/STOMP.
- Responsive UI built with shadcn/ui, Radix UI, Tailwind CSS, and lucide-react icons.

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- TanStack Query
- Axios and Fetch
- Tailwind CSS
- shadcn/ui and Radix UI
- Recharts
- SockJS and STOMP
- jsPDF and html2canvas
- Supabase client integration

## Requirements

- Node.js 18 or newer
- npm
- Running Jurist backend API

## Environment Variables

Create or update `.env` in this project root:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

`VITE_API_BASE_URL` must point to the Spring Boot backend. Supabase values are required only for features that use `src/integrations/supabase`.

## Getting Started

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

Build for production:

```sh
npm run build
```

Preview the production build locally:

```sh
npm run preview
```

Run ESLint:

```sh
npm run lint
```

## Local Port Note

The Vite config currently uses port `8080`, and the backend also runs on `8080` by default. When running both locally, change one of them. A common setup is:

- Backend: `http://localhost:8080`
- Frontend: `http://localhost:8081`

To use `8081` for the frontend, update `server.port` in `vite.config.ts` and keep:

```env
VITE_API_BASE_URL=http://localhost:8080
```

The backend CORS configuration already allows `http://localhost:8081` and `http://localhost:3000`.

## Project Structure

```text
src/
  assets/              Static project images and logos
  components/          Shared UI, layout, dashboard, lawyer, case, and aid components
  components/ui/       shadcn/ui primitives
  hooks/               Custom React hooks
  integrations/        External integrations such as Supabase
  lib/                 Utility and API helper modules
  pages/               Route-level screens
  services/            Business API services and mappers
  types/               Shared TypeScript types
```

## Main Routes

- `/` - login
- `/forgot-password` - request password reset
- `/reset-password` - reset password from token
- `/dashboard` - protected dashboard
- `/lawyers` - protected lawyer management
- `/cases` - protected case management
- `/aides-judiciaires` - protected judicial aid management
- `/change-password` - protected password change

## Docker

The project includes a production Dockerfile that builds the Vite app with Node 20 and serves it with nginx.

In the full Docker Compose setup, start the complete stack from the repository root:

```sh
docker compose up --build
```

Then open:

```text
http://localhost:3000
```

## Backend Integration

The UI calls the backend using `VITE_API_BASE_URL`. In Docker, this value is injected at container startup through `/env-config.js`.

For the default compose setup, keep `VITE_API_BASE_URL` empty so browser requests use the same origin and nginx proxies `/api`, `/auth`, and `/ws` to `http://backend:8080`.

Real-time notifications connect to:

```text
{VITE_API_BASE_URL}/ws
```

## Deployment

1. Set production environment variables.
2. Run `npm run build`.
3. Deploy the generated `dist/` directory to a static host such as Netlify, Vercel, or another web server.
4. Ensure the backend CORS configuration allows the deployed frontend URL.
