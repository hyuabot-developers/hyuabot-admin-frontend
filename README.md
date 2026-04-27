# HYUabot Admin Frontend

Admin dashboard for managing Hanyang University campus information and services — shuttle buses, city buses, subway, cafeteria menus, reading rooms, contacts, academic calendar, and notices.

## Overview

HYUabot Admin Frontend is a single-page application built with React 19 and Vite, providing a comprehensive CRUD interface for all data managed by the HYUabot backend API. It serves administrators who maintain the data behind the HYUabot student mobile app.

The UI is organized around eight service domains, each with dedicated management screens backed by inline MUI DataGrid editing and a RESTful API.

---

## Tech Stack

| Layer            | Technology                                         |
|------------------|----------------------------------------------------|
| Framework        | React 19 + TypeScript 5.7 (strict)                 |
| Build tool       | Vite 7 with `@vitejs/plugin-react-swc`             |
| Routing          | React Router DOM v7                                |
| UI components    | Material UI (MUI) v7 + MUI DataGrid                |
| State management | Zustand v5                                         |
| HTTP client      | Axios 1.12                                         |
| Date utilities   | Day.js                                             |
| Code quality     | ESLint 9, Prettier, Husky, lint-staged, commitlint |
| Package manager  | Yarn 1.22                                          |

---

## Features

### Shuttle Bus Management (`/shuttle`)
- **Periods** — Define operational periods (semester, vacation, etc.)
- **Holidays** — Mark non-service dates per period
- **Routes** — Create and manage named shuttle routes
- **Stops** — Manage physical shuttle stop locations
- **Route Stops** — Assign stops to routes with sequence and timing offsets
- **Timetables** — Define departure times per route per period with weekday/weekend differentiation
- **Timetable View** — Multi-leg timetable visualization for a selected route

### City Bus Management (`/bus`)
- **Routes** — Manage public bus route metadata
- **Stops** — Manage bus stop information
- **Route Stops** — Map stops to routes with sequence
- **Timetables** — Manage scheduled departure times
- **Realtime** — View real-time departure data for a route
- **Logs** — Query historical departure log data

### Subway Management (`/subway`)
- **Stations** — Manage subway station information
- **Routes** — Manage subway line/route data
- **Timetables** — Define scheduled timetables per station
- **Realtime** — View real-time train departure data

### Cafeteria Management (`/cafeteria`)
- **Cafeterias** — Manage dining hall locations and metadata
- **Menus** — Add and update daily menu items per cafeteria

### Reading Room Management (`/readingRoom`)
- **Rooms** — Manage campus study room information and capacity

### Contact Directory (`/contact`)
- **Categories** — Organize contacts into categories
- **Seoul Campus Contacts** — Manage department contacts for the Seoul campus
- **ERICA Campus Contacts** — Manage department contacts for the ERICA campus

### Academic Calendar (`/calendar`)
- **Categories** — Define calendar event categories
- **Events** — Create and manage academic calendar events

### Notice Management (`/notice`)
- **Categories** — Organize announcements by category
- **Notices** — Create and publish campus notices

---

## Project Structure

```
hyuabot-admin-frontend/
├── src/
│   ├── routes/
│   │   ├── index.tsx              # Root router setup
│   │   └── pages/
│   │       ├── home.tsx           # Authenticated layout (drawer + header)
│   │       ├── login/             # Login page
│   │       ├── shuttle/           # Shuttle feature module
│   │       │   ├── period/        # Period management
│   │       │   ├── holiday/       # Holiday management
│   │       │   ├── route/         # Route management
│   │       │   ├── stop/          # Stop management
│   │       │   ├── routeStop/     # Route-stop mapping
│   │       │   ├── timetable/     # Timetable management
│   │       │   └── timetableView/ # Timetable visualization
│   │       ├── bus/               # Bus feature module
│   │       ├── subway/            # Subway feature module
│   │       ├── cafeteria/         # Cafeteria feature module
│   │       ├── readingRoom/       # Reading room feature module
│   │       ├── contact/           # Contact feature module
│   │       ├── calendar/          # Calendar feature module
│   │       └── notice/            # Notice feature module
│   ├── service/
│   │   └── network/
│   │       ├── client.ts          # Axios instance with token-refresh interceptor
│   │       ├── auth.ts            # Auth API calls (login, logout, profile)
│   │       ├── shuttle.ts         # Shuttle API calls + TypeScript types
│   │       ├── bus.ts             # Bus API calls + TypeScript types
│   │       ├── subway.ts          # Subway API calls + TypeScript types
│   │       ├── cafeteria.ts       # Cafeteria API calls + TypeScript types
│   │       ├── readingRoom.ts     # Reading room API calls + TypeScript types
│   │       ├── contact.ts         # Contact API calls + TypeScript types
│   │       ├── calendar.ts        # Calendar API calls + TypeScript types
│   │       └── notice.ts          # Notice API calls + TypeScript types
│   ├── stores/
│   │   ├── auth.ts                # Authentication state
│   │   ├── home.ts                # Drawer open/close state
│   │   ├── shuttle.ts             # Shuttle module state
│   │   ├── bus.ts                 # Bus module state
│   │   ├── subway.ts              # Subway module state
│   │   ├── cafeteria.ts           # Cafeteria module state
│   │   ├── readingRoom.ts         # Reading room module state
│   │   ├── contact.ts             # Contact module state
│   │   ├── calendar.ts            # Calendar module state
│   │   └── notice.ts              # Notice module state
│   └── styles/
│       ├── globalTheme.ts         # MUI theme (Hanyang colors + Godo font)
│       └── globalStyle.ts         # Global CSS-in-JS styles
├── public/
│   └── images/
│       └── hanyangCharacter.png   # App icon
├── .github/
│   └── workflows/
│       ├── default.yml            # Lint + build checks on PRs
│       └── deploy.yml             # Production deployment on merge to main
├── .husky/
│   └── pre-commit                 # Runs lint-staged before every commit
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── eslint.config.js
└── package.json
```

Each feature module under `routes/pages/` follows a consistent three-file pattern:
- `index.tsx` — Page component: mounts the store, fetches data, composes the layout
- `grid.tsx` — MUI DataGrid with inline row editing, save/cancel/delete actions
- `toolbar.tsx` — Toolbar with "Create" (and sometimes "Delete All") buttons

---

## Getting Started

### Prerequisites

- Node.js 22+
- Yarn 1.22+
- A running instance of the [HYUabot backend API](https://github.com/hyuabot-developers/hyuabot-backend-python)

### Installation

```bash
git clone https://github.com/hyuabot-developers/hyuabot-admin-frontend.git
cd hyuabot-admin-frontend
yarn install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_APP_API_URL=https://your-api-server.example.com
```

| Variable           | Description                                             |
|--------------------|---------------------------------------------------------|
| `VITE_APP_API_URL` | Base URL of the HYUabot backend API (no trailing slash) |

### Running Locally

```bash
yarn dev          # Start dev server at http://localhost:3000 with HMR
yarn build        # TypeScript compile + Vite production build → dist/
yarn preview      # Serve the production build locally
yarn lint         # Run ESLint across the entire codebase
```

---

## Authentication

The app uses **cookie-based JWT authentication**.

1. `POST /api/v1/user/token` with username and password (form-encoded)
2. The server returns HTTP 201 and sets `access_token` / `refresh_token` cookies
3. The frontend also stores the tokens in `localStorage` (`accessToken`, `refreshToken`)
4. All subsequent requests use `withCredentials: true` so cookies are sent automatically
5. The Axios response interceptor catches **HTTP 403** and transparently calls `PUT /api/v1/user/token` to refresh the session, then retries the original request
6. If the refresh also fails, `localStorage` is cleared and the user is redirected to `/login`

---

## API Integration

All API calls live in `src/service/network/`. Each module file exports:
- TypeScript interfaces for request and response payloads
- Typed async functions wrapping Axios calls

Base URL is read from `import.meta.env.VITE_APP_API_URL` at build time.

### Endpoint Overview

| Resource           | Endpoints                                                        |
|--------------------|------------------------------------------------------------------|
| Auth               | `POST/PUT/DELETE /api/v1/user/token`, `GET /api/v1/user/profile` |
| Shuttle period     | `/api/v1/shuttle/period`                                         |
| Shuttle holiday    | `/api/v1/shuttle/holiday`                                        |
| Shuttle route      | `/api/v1/shuttle/route`                                          |
| Shuttle stop       | `/api/v1/shuttle/stop`                                           |
| Shuttle route stop | `/api/v1/shuttle/route/{routeName}/stop`                         |
| Shuttle timetable  | `/api/v1/shuttle/route/{routeName}/timetable`                    |
| Bus route          | `/api/v1/bus/route`                                              |
| Bus stop           | `/api/v1/bus/stop`                                               |
| Bus route stop     | `/api/v1/bus/route/{routeID}/stop`                               |
| Bus timetable      | `/api/v1/bus/route/{routeID}/timetable`                          |
| Bus realtime       | `/api/v1/bus/realtime/{routeID}`                                 |
| Bus log            | `/api/v1/bus/log`                                                |
| Subway station     | `/api/v1/subway/station`                                         |
| Subway route       | `/api/v1/subway/route`                                           |
| Subway timetable   | `/api/v1/subway/station/{stationID}/timetable`                   |
| Subway realtime    | `/api/v1/subway/realtime`                                        |
| Cafeteria          | `/api/v1/cafeteria`                                              |
| Menu               | `/api/v1/cafeteria/{cafeteriaID}/menu`                           |
| Reading room       | `/api/v1/readingRoom`                                            |
| Contact category   | `/api/v1/contact/category`                                       |
| Contact (Seoul)    | `/api/v1/contact/seoul`                                          |
| Contact (ERICA)    | `/api/v1/contact/erica`                                          |
| Calendar category  | `/api/v1/calendar/category`                                      |
| Calendar event     | `/api/v1/calendar/event`                                         |
| Notice category    | `/api/v1/notice/category`                                        |
| Notice             | `/api/v1/notice`                                                 |

---

## State Management

Global state is managed with **Zustand** (devtools middleware enabled for all stores).

Each feature module has its own store containing:
- The list of items fetched from the API
- A `GridRowModesModel` for tracking which DataGrid rows are in edit mode
- Setter functions consumed by page components and grid components

The `auth` store holds user info and exposes `useAuthenticatedStore` and `useUserInfoStore` hooks.

---

## Code Style

| Rule            | Setting                                        |
|-----------------|------------------------------------------------|
| Quotes          | Single                                         |
| Semicolons      | None                                           |
| Indentation     | 4 spaces                                       |
| Trailing commas | Multiline only                                 |
| Import order    | builtin → external → internal → parent/sibling |
| TypeScript      | Strict mode, no `any`, no unused locals/params |

Prettier and ESLint are enforced via a **Husky pre-commit hook** running `lint-staged`. Only staged files are linted on commit.

Commits must follow the **Conventional Commits** spec (enforced by commitlint).

---

## CI/CD

### `default.yml` — Continuous Integration

Triggered on push to any non-main branch and on pull request creation.

| Job          | Condition       | Steps                                              |
|--------------|-----------------|----------------------------------------------------|
| `lint`       | Always          | Checkout → Node 22 → `yarn install` → `yarn lint`  |
| `test-build` | PR to main only | Checkout → Node 22 → `yarn install` → `yarn build` |

Runs on self-hosted runners.

### `deploy.yml` — Continuous Deployment

Triggered on manual dispatch or when a PR is merged to `main`.

1. Checkout → Node 22 → `yarn install`
2. Generate `.env` with `VITE_APP_API_URL` from GitHub secrets
3. `yarn build` → `dist/`
4. Copy `dist/*` to `/home/ubuntu/hyuabot-admin-frontend/` on the Oracle server

The built static files are served directly by a web server (e.g., Nginx) on the Oracle Cloud instance.

---

## Branding

| Token           | Value                  | Usage                                                  |
|-----------------|------------------------|--------------------------------------------------------|
| Primary color   | `#0e4a84`              | Hanyang University blue — app bar, buttons, highlights |
| Secondary color | `#f08100`              | Hanyang University orange — accents                    |
| Font            | Godo                   | Korean-optimized serif font used throughout the UI     |
| Logo            | `hanyangCharacter.png` | Hanyang University mascot                              |

---

## Related Repositories

- **Backend API**: [hyuabot-backend-kotlin](https://github.com/hyuabot-developers/hyuabot-backend-kotlin)
- **Android App**: [hyuabot-client-android](https://github.com/hyuabot-developers/hyuabot-client-android)
- **iOS App**: [hyuabot-client-ios](https://github.com/hyuabot-developers/hyuabot-client-android)

---

## License

This project is maintained by the HYUabot development team. See the repository settings for license information.
