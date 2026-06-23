# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (localhost:5173, auto-open)
npm run build        # TypeScript check + Vite build for GitHub Pages
npm run build:h5     # Build for mobile H5 (mode flag set)
npm run lint         # ESLint
npm run preview      # Preview production build locally
```

No test suite is configured yet.

## Architecture

This is a **mobile-first utility bill payment app** (费用缴费系统) built with React 19, targeting GitHub Pages deployment. It uses **mock data only** — no backend is connected.

### Tech Stack

| Concern | Library |
|---------|---------|
| UI components | Ant Design Mobile 5 (mobile-first) |
| Routing | React Router v6 (`createBrowserRouter`) |
| State | Zustand 5 with localStorage persistence |
| Data fetching | TanStack React Query 5 (client setup only, no queries written yet) |
| Styling | CSS Modules + CSS custom properties + TailwindCSS 4 (via Vite plugin) |
| Build | Vite 8 with Oxc React plugin |

### Route Structure

```
/ (AppLayout wrapper with bottom TabBar)
├── /           → Home (bill categories + recent records)
├── /records    → Payment history
├── /profile    → User profile
├── /pay/form/:category  → Payment form
├── /pay/confirm         → Confirm payment
└── /pay/result          → Result screen

/login → redirects to /
```

All routes are lazy-loaded. `basename` is derived from `import.meta.env.BASE_URL` so routing works both locally and on GitHub Pages (`/fee-ui-system/`).

### State Management

`src/store/auth.ts` — Zustand store persisted to localStorage:
- `token`, `userId`, `login()`, `logout()`

### Data Layer

No API integration exists yet. All data comes from `src/utils/mock.ts` (mock bills and payment records). Types live in `src/types/bill.ts`.

Amount values are stored in **fen (分)** — use `formatAmount()` from `src/utils/format.ts` to display in yuan.

### Styling Conventions

- **CSS Variables** are defined in `src/styles/variables.css` — covers colors, spacing, typography, z-index layers, layout dimensions (tabbar height, safe areas). Use these instead of hardcoded values.
- **CSS Modules** for component styles (`Component.module.css`).
- **`src/styles/base.css`** contains the global reset, layout grid (100dvh with fixed TabBar), and utility classes (`.flex`, `.truncate`, etc.).
- Root font-size uses `clamp(14px, 4vw, 18px)` — PostCSS px-to-rem conversion is NOT active (postcss.config.js is empty); use `px` directly.

### Build Targets

The `vite.config.ts` sets `base` conditionally:
- `GITHUB_ACTIONS` env → `/fee-ui-system/`
- `--mode h5` → `/h5/`
- Otherwise → `/`

Manual chunk splitting groups `antd-mobile` and `react`/`react-router-dom` into separate vendor chunks.

### Deployment

GitHub Actions (`.github/workflows/deploy.yml`) auto-deploys `dist/` to GitHub Pages on push to `main`. Uses Node 22.
