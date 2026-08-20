# Dhaancha

## Overview
An Express API Template

## Tech Stack
- Express 5 - server framework
- Drizzle ORM (Postgres) - database
- Zod - schema validation
- Vitest - testing
- Winston - logging
- Swagger UI - documentation

## Project Structure
```
src/
├── config/          # env validation, drizzle config, logging config
├── controllers/     # request handlers
├── db/              # drizzle schema + client
├── middlewares/     # error handling, rate limiting, logging, validation
├── routes/          # route definitions
├── swagger/         # OpenAPI docs
├── types/           # shared type declarations
└── utils/           # error classes, async wrappers
tests/               # vitest test suite
```

## Getting Started
1. **Use this template** on GitHub, or clone directly:
```bash
git clone https://github.com/yudin101/dhaancha.git
cd dhaancha
```
2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```
   Fill in real values in `.env` (see [Environment Variables](#environment-variables) below).

4. **Start the dev server**
```bash
npm run dev
```
   Requires a running Postgresql instance.

   Server runs on the port set in `SERVER_PORT`. API docs at `/api/docs`.

## Environment Variables
| Variable      | Description                           | Example                           |
|---------------|---------------------------------------|-----------------------------------|
| FRONTEND_URL  | Used for CORS allowed-origin config   | https://example.com               |
| SERVER_PORT   | Port the server listens on            | 3000                              |
| DATABASE_URL  | Postgres connection string            | postgresql://user:pass@host/db    |

## Available Scripts
| Script         | Description                           |
|----------------|---------------------------------------|
| dev            | Run with hot reload (tsx --watch)     |
| build          | Compile TypeScript to dist/           |
| start          | Run compiled build (production)       |
| db:push        | Push schema directly (local dev)      |
| db:generate    | Generate migration files              |
| db:migrate     | Apply pending migrations              |
| db:studio      | Open Drizzle Studio                   |
| test           | Run tests once                        |
| test:watch     | Run tests in watch mode               |

## Design Decisions & Notes
- **Module system:** ESM. TypeScript is configured with `moduleResolution: nodenext`, so relative imports need `.js` extensions even in `.ts` files. 

- **Env validation:** All environment variables are validated at startup via Zod (`src/config/env.config.ts`). If a required var is missing or malformed, the app throws and exits immediately rather than failing later on first use.

- **DB connection check:** The server pings the database with a trivial query before calling `app.listen()`. If Postgres isn't reachable, the process exits.

- **Migrations:** Not committed by default (`drizzle/` is gitignored). This template uses `db:push` for local iteration. Before deploying or once the schema stabilizes, switch to `db:generate` + `db:migrate`, and un-ignore `drizzle/` in that project so migration files get tracked.

- **Health check:** `/health` currently performs a database uptime check and returns 200 if active.

- **Auth:** Not included. BetterAuth might be added later.

- **Logging:** Winston writes to `logs/` locally. No external log transport.

- **Rate limiting:** `express-rate-limit` is applied globally by default in `src/middlewares/rateLimit.middleware.ts`.

- **API docs:** Swagger UI is served at `/api/docs`, generated from schemas in `src/swagger/`. New routes need a corresponding swagger file to show up in docs.

## Contributing

Contributions are always welcome!

If you'd like to contribute to this template, you can:

- **Create an Issue**: Report bugs or suggest features by [creating an issue](https://github.com/yudin101/dhaancha/issues/new).
- **Open a Pull Request**: Submit code changes or improvements by [opening a pull request](https://github.com/yudin101/dhaancha/pulls).

## License

This template is licensed under the [MIT License](https://github.com/yudin101/dhaancha/blob/main/LICENSE).
