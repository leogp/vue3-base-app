# vue3-base-app

A Vue 3 SPA starter with authentication, protected routing, and CRUD posts — built as a learning project.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3 (`<script setup>` Composition API) |
| Language | TypeScript 5.4 |
| Build tool | Vite 5 |
| UI library | Vuetify 3 + Material Design Icons |
| State management | Pinia + `pinia-plugin-persistedstate` |
| Routing | Vue Router 4 |
| Testing | Vitest + Vue Testing Library |
| Linting/formatting | ESLint + Prettier |

---

## Setup

No local Node.js installation required — you can run everything through Docker (see below). If you prefer running locally:

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5174)
npm run dev
```

### All commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 5174 |
| `npm run build` | Type-check + build for production |
| `npm run preview` | Preview production build |
| `npm run type-check` | TypeScript check only |
| `npm run lint` | ESLint with auto-fix |
| `npm run format` | Prettier format `src/` |
| `npm run test` | Run tests with Vitest |
| `npm run test:coverage` | Run tests with coverage report |

### Docker (no local dependencies needed)

If you don't want to install Node.js or npm on your machine, Docker Compose handles everything. The container installs dependencies and runs the dev server automatically.

```bash
# Start dev server (http://localhost:5174) — no npm install needed
docker compose up

# Run any other command inside the container
docker exec vue-base npm run build
docker exec vue-base npm run lint
docker exec vue-base npm run format
docker exec vue-base npm run type-check
docker exec vue-base npm run test
docker exec vue-base npm run test:coverage
```

---

## Project structure

```
src/
├── main.ts                  # App entry point (Vue, Pinia, Router, Vuetify setup)
├── App.vue                  # Root component
├── views/                   # Route-level pages
│   ├── LoginView.vue
│   ├── HomeView.vue
│   ├── PostsView.vue
│   └── PostView.vue         # Create / edit a post
├── components/              # Reusable UI
│   ├── FormLogin.vue
│   ├── FormPost.vue
│   ├── NavBar.vue
│   ├── ThePosts.vue
│   └── PostsFilter.vue
├── composables/             # Shared composition functions
│   ├── useAuth.ts
│   ├── usePostFilters.ts
│   ├── useTheme.ts
│   └── useConfirmDialog.ts
├── stores/                  # Pinia stores
│   ├── auth.ts              # User session (persisted)
│   └── posts.ts             # Posts state
├── services/                # API layer
│   ├── auth.service.ts
│   ├── posts.service.ts
│   ├── auth.endpoints.ts
│   └── api.endpoints.ts
├── interfaces/              # Shared TypeScript interfaces
│   ├── auth.ts
│   └── post.ts
└── router/
    ├── index.ts             # Router with auth guards
    └── routes.ts            # Route name constants
```

---

## Routing

| Path | View | Auth required |
|---|---|---|
| `/` | `LoginView` | No (redirects to `/home` if already logged in) |
| `/home` | `HomeView` | Yes |
| `/home/posts` | `PostsView` | Yes |
| `/home/form-post/:id?` | `PostView` | Yes |

The global `beforeEach` guard redirects unauthenticated users to `/` when they access any route with `meta.requiredAuth: true`. The auth token is read from the persisted Pinia store.

---

## Auth flow

1. User submits credentials in `FormLogin`.
2. `useAuth` composable calls `authStore.authUser()`.
3. The store delegates to `AuthService.login()`, which POSTs to:
   ```
   POST https://dummyjson.com/auth/login
   { username, password, expiresInMins: 30 }
   ```
4. On success, `userId`, `username`, `email`, and `token` are saved in the `auth` Pinia store and persisted to `localStorage`.
5. The router redirects to `/home`.
6. On logout, the store is reset and the user is redirected to `/`.

Test credentials from [dummyjson.com/users](https://dummyjson.com/users) work (e.g., `emilys` / `emilyspass`).

---

## API integrations

### Posts — `jsonplaceholder.typicode.com`

| Operation | Endpoint |
|---|---|
| List all posts | `GET /posts` |
| List with filters | `GET /posts?userId=&q=` |
| Get single post | `GET /posts/:id` |
| Create post | `POST /posts` |
| Update post | `PUT /posts/:id` |
| Delete post | `DELETE /posts/:id` |

Base URL: `https://jsonplaceholder.typicode.com/posts`

Endpoint builders live in `src/services/api.endpoints.ts`. Note that JSONPlaceholder is a mock API — mutations are accepted but not actually persisted.

---
