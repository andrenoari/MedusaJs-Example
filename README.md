# Morrow + Medusa

This workspace contains two pieces:

- `src/`: the Morrow storefront demo built with Vite and React.
- `backend/apps/backend/`: a real Medusa v2.20.1 backend with the official Admin dashboard and commerce modules.

The storefront is intentionally kept separate from the backend so it can be replaced with another channel later. The backend exposes the Medusa Store API on port `9000` and the Admin dashboard at `/app`.

## Publish with Coolify

This repository is ready to deploy as one Coolify **Docker Compose** resource.

1. Push the repository to GitHub/GitLab and create a new Coolify resource from that repository. Choose **Docker Compose** as the build pack and use the root `docker-compose.yml`.
2. Add these environment variables in the resource's **Environment Variables** panel. Use the production domains you will configure in the next step:

```text
POSTGRES_PASSWORD=generate-a-long-random-password
JWT_SECRET=generate-a-different-long-random-secret
COOKIE_SECRET=generate-another-long-random-secret
AUTH_MFA_ENCRYPTION_KEY=64-hex-characters
STORE_CORS=https://shop.example.com
ADMIN_CORS=https://admin.example.com
AUTH_CORS=https://shop.example.com,https://admin.example.com
```

`AUTH_MFA_ENCRYPTION_KEY` should be a stable 64-character hexadecimal value. Generate one with `openssl rand -hex 32`.

3. In Coolify's service settings, assign domains by service:

- `storefront`, port `80`: `https://shop.example.com`
- `medusa`, port `9000`: `https://admin.example.com`
- Leave `postgres` and `redis` without public domains.

4. Deploy. Coolify will build the storefront and Medusa containers and provision TLS certificates for the assigned domains.
5. Run the first migration from the Coolify terminal for the `medusa` service:

```bash
cd apps/backend && npx medusa db:migrate
npx medusa user -e admin@example.com -p 'replace-with-a-long-password'
```

6. Open `https://admin.example.com/app` and sign in. The storefront is at `https://shop.example.com`.

The current storefront is visual/local-data only. It will publish correctly as-is, but it will not read products from Medusa until its catalog and checkout calls are wired to the Store API. The backend Admin is fully real and ready for product, inventory, order, customer, promotion, region, sales channel, and settings management.

## Backend on a VPS

Requirements: Docker Compose and a VPS with ports `80`/`443` available behind your reverse proxy.

1. Copy the backend environment template:

```bash
cp backend/apps/backend/.env.template backend/apps/backend/.env
```

2. Change `POSTGRES_PASSWORD`, `JWT_SECRET`, `COOKIE_SECRET`, `AUTH_MFA_ENCRYPTION_KEY`, and the CORS values in your environment. The Compose file reads these directly.

3. Start PostgreSQL, Redis, and Medusa:

```bash
docker compose up -d --build
```

4. Run migrations and create the first Admin user:

```bash
docker compose exec medusa sh -c "cd apps/backend && npx medusa db:migrate"
docker compose exec medusa sh -c "cd apps/backend && npx medusa user -e admin@example.com -p 'replace-with-a-long-password'"
```

5. Open `https://your-domain.example/app` through your reverse proxy and sign in. The dashboard includes products, variants, inventory, orders, customers, promotions, regions, sales channels, settings, and the rest of the Medusa Admin surface.

## Connect the storefront

The current storefront is a visual demo with local product data. To connect it to the Medusa Store API, use the publishable API key from **Admin > Settings > Publishable API keys**, then wire the frontend to:

```text
VITE_MEDUSA_BACKEND_URL=https://your-domain.example
VITE_MEDUSA_PUBLISHABLE_KEY=pk_...
```

The existing UI already models the matching catalog, cart, promotions, checkout, customer orders, and account surfaces.

## Local frontend

```bash
npm install
npm run dev
```

The demo storefront runs on `http://localhost:5173`.

## Generated backend checks

```bash
cd backend
npm install
npm run build --workspace=@dtc/backend
npm run lint --workspace=@dtc/backend
```
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
