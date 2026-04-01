# vue3-base-app

A Vue 3 dashboard built with TypeScript, Vite, and Vuetify 3. Runs entirely inside Docker — no local Node.js installation required.

## Stack

- **Vue 3** — Composition API with `<script setup>`
- **TypeScript** — strict type checking via `vue-tsc`
- **Vite 5** — dev server and build tool
- **Vuetify 3** — UI component library
- **Pinia** — state management (persisted via `pinia-plugin-persistedstate`)
- **Vue Router 4** — client-side routing with auth guards

## Architecture

```
src/
├── views/          # Route-level pages (LoginView, HomeView, PostsView, PostView)
├── components/     # Reusable UI (FormLogin, FormPost, NavBar, ThePosts)
├── stores/         # Pinia stores (auth)
├── services/       # API layer (auth.service.ts, api.endpoints.ts)
├── interfaces/     # Shared TypeScript interfaces
├── router/         # Vue Router config with auth guards
└── main.ts         # App entry point
```

**Routing:**
- `/` — Login (redirects to `/home` if already authenticated)
- `/home` — Dashboard shell with navbar (protected)
  - `/home/posts` — Posts list with edit/delete
  - `/home/form-post/:id?` — Create or edit a post

**External APIs:**
- Auth: `https://dummyjson.com/auth/login`
- Posts: `https://jsonplaceholder.typicode.com/posts`

## Getting started

Requires **Docker** and **Docker Compose**.

```sh
git clone git@github.com:leogp/vue3-base-app.git
cd vue3-base-app
docker compose up --build
```

App is available at `http://localhost:5174`.

To stop: `docker compose down`

## Dev commands

Run these inside the container with `docker exec vue-base <cmd>`:

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 5174 |
| `npm run build` | Type-check + production build |
| `npm run type-check` | TypeScript check only |
| `npm run lint` | ESLint with auto-fix |
| `npm run format` | Prettier format `src/` |
| `npm run preview` | Preview production build |

## Author

**Leonardo Puglisi** — [github.com/leogp](https://github.com/leogp)
