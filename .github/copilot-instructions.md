## Quick summary

This repository contains the Parsec 6.0 frontend (React) application under `parsec-frontend/` and a top-level README describing the project. There are no existing AI-agent instruction files — this document should be the single source of truth for small automated coding agents working here.

Keep instructions short and actionable. When making edits prefer touching files under `parsec-frontend/src/` only unless the change is explicitly cross-cutting.

## Big-picture architecture (what to know)

- Frontend-only React application located in `parsec-frontend/` (bootstrapped with Create React App).
- Routing is central; `src/App.js` declares all routes. Note nested routes for the signup flow (`/signup/*`) and dashboard routes under `/dashboard/*`.
- The dashboard uses a layout component `src/layouts/DashboardLayout.jsx` which renders a sidebar and an `<Outlet />` for nested dashboard pages.
- UI is organized into `src/components/` (reusable pieces) and `src/pages/` (route-level views). Dashboard-specific pages live in `src/pages/dashboard/`.
- Static assets live in `src/assets/` (fonts under `src/assets/fonts/`). Three.js is used (package `three`) for 3D effects in some components.
- Backend, auth, and ticketing are handled separately (not inside this frontend). The top-level README notes that the backend is a separate Node/Express service — do not assume backend code is present here.

## Developer workflows (commands and where to run them)

All frontend commands run from `parsec-frontend/`:

```bash
# install deps
cd parsec-frontend
npm install

# dev server (hot reload)
npm start

# run tests
npm test

# production build
npm run build
```

Use the repository's Create React App scripts listed in `parsec-frontend/package.json`. Do not modify tooling (webpack/babel) unless you also update package.json and add a clear explanation in the PR.

## Project-specific patterns and conventions

- Component/CSS pairing: most components use a same-named CSS file side-by-side (e.g., `ComingSoon.jsx` + `ComingSoon.css`). Keep this convention when adding small components.
- PascalCase filenames for React components in `src/components/` and `src/pages/` (e.g., `Navbar.jsx`, `ComingSoon.jsx`).
- Route-level page files live in `src/pages/`; nested route folders map to nested routes (e.g., `src/pages/signup/` contains the nested signup flow).
- Layouts live in `src/layouts/` and are used to group related routes (e.g., `DashboardLayout.jsx` for `/dashboard/*`). Use `<Outlet />` to render child routes as shown in that layout.
- Minimal inline styles appear in layout scaffolding (see `DashboardLayout.jsx`) but prefer module/global CSS files in `src/` for component styling.

## Integration points and external deps

- Key deps: `react`, `react-dom`, `react-router-dom`, `react-scripts`, and `three` (3D). See `parsec-frontend/package.json` for exact versions.
- Auth and server-side features are external. If a change requires backend support (API endpoints, auth tokens), mention the required server change in the PR and include example request/response shapes.

## Safety and change guidance for AI agents

- Small UI fixes, component additions, styling, and route wiring are safe. Keep changes limited to `parsec-frontend/src/` by default.
- Do not change `parsec-frontend/package.json` scripts or major dependency versions without human approval.
- Where authentication or secure tokens are involved, do not hardcode secrets. If you need environment variables, leave a note and add entries to `.env.example` (do not add actual secrets).

## Useful file references (examples)

- Top-level project notes: `README.md`
- Frontend entry & bootstrapping: `parsec-frontend/src/index.js`
- App routing and routes list: `parsec-frontend/src/App.js` (shows all public and protected routes)
- Dashboard layout: `parsec-frontend/src/layouts/DashboardLayout.jsx` (sidebar + <Outlet /> pattern)
- Components: `parsec-frontend/src/components/` (e.g., `Navbar.jsx`, `ComingSoon.jsx`)
- Package scripts & dependencies: `parsec-frontend/package.json`

## Example tasks (how to do them quickly)

- Add a new public page and route:
  1. Create `src/pages/MyPage.jsx` (PascalCase), `src/pages/MyPage.css`.
  2. Add a route in `src/App.js`: <Route path="/my-page" element={<MyPage/>} />.
  3. Run `npm start` from `parsec-frontend/` and verify at `/my-page`.

- Add a new dashboard page:
  1. Create `src/pages/dashboard/MyDashboardPage.jsx` and CSS.
  2. Add nested route inside the `<Route path="/dashboard" element={<DashboardLayout />}>` block in `src/App.js`: `<Route path="my-page" element={<MyDashboardPage/>} />`.

## When in doubt / PR checklist for AI-generated changes

- Keep changes small and focused (one feature/fix per PR).
- Run `npm start` locally and manually confirm visible UI changes where applicable.
- Include references to modified files in the PR description and mention any backend contract changes required.

---

If any sections above are unclear or you want more detail about routes, auth, or build integration, tell me which area to expand and I will update this file accordingly.
