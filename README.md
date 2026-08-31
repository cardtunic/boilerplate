# SvelteKit + Hono Cloudflare Boilerplate

A full-stack TypeScript monorepo for building web applications on Cloudflare Workers. It combines a SvelteKit frontend with a Hono API, Effect services, PostgreSQL, and end-to-end type-safe API calls.

The starter includes a complete email/password authentication flow and a protected example endpoint, so you can begin with application code instead of wiring together infrastructure.

## Stack

- [SvelteKit](https://svelte.dev/docs/kit) and Svelte 5
- [Hono](https://hono.dev/) with typed RPC clients
- [Effect](https://effect.website/) for backend services and error handling
- [Better Auth](https://www.better-auth.com/) for authentication
- [Drizzle ORM](https://orm.drizzle.team/) and PostgreSQL
- [Formisch](https://formisch.dev/) and [Valibot](https://valibot.dev/) for typed forms and validation
- [TanStack Query](https://tanstack.com/query) and [neverthrow](https://github.com/supermacro/neverthrow)
- [Tailwind CSS](https://tailwindcss.com/) and [shadcn-svelte](https://www.shadcn-svelte.com/)
- [Cloudflare Workers](https://workers.cloudflare.com/) and Hyperdrive
- pnpm workspaces, Vitest, Oxlint, and Oxfmt

## Included Features

- Registration, login, logout, and session-protected pages
- SSR through SvelteKit's Cloudflare adapter, including server-side auth guards
- Formisch forms backed by shared Valibot schemas
- Better Auth tables and committed Drizzle migrations
- Shared Valibot DTOs for frontend and backend validation
- Generated Hono types consumed directly by the web app
- Service bindings for server-side Worker-to-Worker API calls
- A typed `callApi` helper that exposes responses as `Result` values
- A protected SHA-256 example endpoint at `POST /api/hash`
- Cloudflare Workers integration tests for the API

## Repository Layout

```text
.
├── apps/
│   ├── api/          # Hono Worker, Effect services, auth, and database
│   └── web/          # SvelteKit application
├── packages/
│   └── dto/          # Shared validation schemas and inferred types
├── package.json      # Workspace commands
└── pnpm-workspace.yaml
```

## Prerequisites

- Node.js
- [pnpm](https://pnpm.io/) 10 (the repository pins the exact version through `packageManager`)
- PostgreSQL available at a local connection URL
- A Cloudflare account and Wrangler authentication only when deploying

## Local Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create the API environment file:

   ```bash
   cp apps/api/env.example apps/api/.env
   ```

   Set `BETTER_AUTH_SECRET` to a strong random value. For example:

   ```bash
   openssl rand -base64 32
   ```

   The default API configuration expects PostgreSQL at `postgresql://postgres:root@localhost:5432/postgres`. Change `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` if your local database uses a different URL.

3. Create the web environment file:

   ```bash
   cp apps/web/env.example apps/web/.env
   ```

   `PROXY_API_ORIGIN` defaults to the local Wrangler API at `http://localhost:8787`, allowing browser requests to use the same `/api` paths in development and production.

4. Apply the database migrations:

   ```bash
   pnpm api:db:migrate
   ```

5. Start the development environment:

   ```bash
   pnpm dev
   ```

The web app is available at [http://localhost:5173](http://localhost:5173), and the API health endpoint is available at [http://localhost:8787/api/health](http://localhost:8787/api/health).

The root development command starts the API, Hono type generation, Drizzle Studio, and the SvelteKit development server together.

## Common Commands

| Command                | Description                                      |
| ---------------------- | ------------------------------------------------ |
| `pnpm dev`             | Start the complete local development environment |
| `pnpm web:dev`         | Start only the SvelteKit app                     |
| `pnpm api:dev`         | Start only the Hono Worker                       |
| `pnpm web:check`       | Run Svelte and TypeScript checks                 |
| `pnpm api:test`        | Run API tests in the Workers runtime             |
| `pnpm lint`            | Lint the workspace with Oxlint                   |
| `pnpm lint:fix`        | Apply safe lint fixes                            |
| `pnpm format`          | Format the workspace with Oxfmt                  |
| `pnpm format:check`    | Check formatting without changing files          |
| `pnpm api:db:generate` | Regenerate auth schema and create a migration    |
| `pnpm api:db:migrate`  | Apply pending database migrations                |
| `pnpm api:db:studio`   | Open Drizzle Studio                              |
| `pnpm api:typegen`     | Regenerate Cloudflare and Hono types             |
| `pnpm web:build`       | Build the web Worker                             |

## Type-Safe API Flow

The API exports its Hono application type from `apps/api/src/app.ts`. The `api` package generates declarations into `apps/api/dist-types`, and the web app imports `AppType` through `api/rpc`.

Shared request schemas live in `packages/dto`. A route can validate one of those schemas with Hono's standard validator, while the frontend uses the same schema for form validation. The resulting RPC client infers request bodies, success payloads, error payloads, and status codes without maintaining a separate API specification.

When adding or changing API routes, regenerate declarations with:

```bash
pnpm api:typegen:hono
```

The root `pnpm dev` command watches these declarations automatically.

## Forms and Validation

Login, registration, and the protected hash example use Formisch for form state, submission, and field-level errors. Their schemas come from the shared `packages/dto` workspace package, where Valibot defines both runtime validation and the corresponding TypeScript types.

The API consumes those same schemas through Hono's standard validator. This keeps browser validation and API validation aligned without duplicating request models.

## Server-Side Rendering

The web application supports SvelteKit SSR and targets Cloudflare Workers through `@sveltejs/adapter-cloudflare`.

API access works in both rendering environments:

- In the browser, the typed Hono client calls same-origin `/api` routes. Vite proxies those requests to the local API during development.
- During SSR, the web Worker calls the API Worker directly through the `API` service binding, avoiding a public network round trip.
- Server-side API calls can forward the incoming cookie header so authenticated loads retain the user's session.
- Server layout loads resolve sessions and redirect users before rendering protected or auth-only pages.

The environment-aware client is implemented in `apps/web/src/lib/api.ts`, while server-side session loading is handled by `apps/web/src/lib/server/getUserSession.ts`.

## Database Changes

Database schema files live in `apps/api/src/database/schema`. After changing them, generate and apply a migration:

```bash
pnpm api:db:generate
pnpm api:db:migrate
```

`api:db:generate` also regenerates the Better Auth schema before creating the Drizzle migration. Review generated migration files before applying them to shared or production databases.

## Deployment

Both applications are configured as Cloudflare Workers:

- `apps/api/wrangler.jsonc` deploys the API and binds PostgreSQL through Hyperdrive.
- `apps/web/wrangler.jsonc` deploys SvelteKit and binds the API Worker as the `API` service.

Before deploying your own application:

1. Replace the Worker names, routes, zone names, and Hyperdrive ID in both Wrangler files.
2. Configure the API's production Better Auth values and web origin as Cloudflare secrets or variables.
3. Ensure the web Worker's `API` service binding matches the deployed API Worker name.
4. Apply migrations to the production PostgreSQL database.
5. Authenticate Wrangler with `pnpm --filter api exec wrangler login` if needed.

Deploy the API first, followed by the web app:

```bash
pnpm api:deploy
pnpm web:deploy
```

## Customizing the Template

At minimum, update the following before using this repository for a new project:

- Root package name in `package.json`
- Worker names and routes in both `wrangler.jsonc` files
- Hyperdrive binding and database connection
- `BETTER_AUTH_APP_NAME`, authentication URLs, and trusted web origin
- Landing page, metadata, and example dashboard route

## License

MIT
