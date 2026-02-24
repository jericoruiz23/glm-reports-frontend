# AGENTS.md

Guidance for coding agents working in `glm-reports-frontend`.

## Project snapshot

- App type: React SPA based on `react-scripts` (Create React App).
- Language: JavaScript (`.js`, `.jsx`), no TypeScript configured.
- UI stack: MUI (`@mui/material`) plus custom CSS and inline styles.
- Routing: `react-router-dom` with a centralized route config.
- Data access: `fetch` wrapped in `src/services/api.js`.
- Auth/session: context provider in `src/context/AuthContext.jsx`.
- Package manager: npm (`package-lock.json` present).

## Working rules for agents

- Prefer small, focused changes that match existing architecture.
- Do not introduce TypeScript or new build tools unless explicitly requested.
- Reuse existing service/context patterns instead of adding parallel abstractions.
- Keep route declarations in `src/routes/routesConfig.js` as source of truth.
- Avoid broad refactors while handling feature or bug tasks.
- If you change behavior, update or add tests where practical.

## Setup and run commands

- Install deps: `npm install`
- Start dev server: `npm start`
- Production build: `npm run build`
- Run full test suite once (non-watch): `npm test -- --watchAll=false`
- Run tests in watch mode: `npm test`

## Lint and quality commands

This repo has CRA ESLint config in `package.json` but no dedicated lint script.

- Lint all JS/JSX: `npx eslint "src/**/*.{js,jsx}"`
- Lint with zero warnings allowed: `npx eslint "src/**/*.{js,jsx}" --max-warnings=0`
- Auto-fix safe lint issues: `npx eslint "src/**/*.{js,jsx}" --fix`

Notes:

- `npm run build` also surfaces many lint errors in CRA workflows.
- If you add a `lint` script, keep command behavior equivalent to above.

## Test commands (with single-test focus)

Jest runs through CRA (`react-scripts test`).

- Run all tests once: `npm test -- --watchAll=false`
- Run one test file: `npm test -- src/path/to/file.test.jsx --watchAll=false`
- Run files by path pattern:
  - `npm test -- --watchAll=false --testPathPattern=AuthContext`
- Run one test case by name:
  - `npm test -- --watchAll=false --testNamePattern="logs out user"`

Helpful combinations:

- Single file + single case:
  - `npm test -- src/pages/Login.test.jsx --watchAll=false --testNamePattern="submits credentials"`
- Debug flaky tests serially:
  - `npm test -- --watchAll=false --runInBand`

## Current codebase structure

- Entry point: `src/index.jsx`
- Top-level routes: `src/App.js` + `src/routes/routesConfig.js`
- Pages: `src/pages/**`
- Shared UI: `src/components/**`
- Context/state: `src/context/**`
- API and side effects: `src/services/**`
- Hooks: `src/hooks/**`

## Import conventions

The codebase is somewhat mixed today. For new or edited files, use this order:

1. React and core libs
2. Third-party packages (`@mui/*`, `recharts`, etc.)
3. Absolute/aliased imports (if introduced later)
4. Relative app imports (`../...`)
5. Styles/assets imports

Additional rules:

- Keep one blank line between each import group.
- Prefer named imports when importing multiple symbols from one module.
- Avoid deep relative paths when a local barrel file already exists.
- Remove unused imports in the same change.

## Formatting conventions

- Use double quotes for strings.
- Use semicolons.
- Prefer `const`; use `let` only when reassignment is needed.
- Keep trailing commas in multiline objects/arrays/imports.
- Keep JSX readable: break long prop lists across lines.
- Keep functions small; extract helpers for nested logic.
- Follow existing indentation in the touched file; do not reformat unrelated blocks.

## Types and data-shape guidance

No TypeScript is configured. Use runtime-safe JavaScript patterns:

- Validate required API inputs before submission.
- Guard nullable data with optional chaining and sensible defaults.
- Prefer explicit object shapes in transformations.
- When useful, add JSDoc to document non-obvious params/returns.
- Do not introduce `.ts`/`.tsx` files unless requested.

## Naming conventions

- React components: PascalCase (`ManageReports`, `PrivateRoute`).
- Hooks: `useX` naming (`useTimes`).
- Context providers: `XProvider`; context hooks: `useX`.
- Utility/helper functions: camelCase with verb-first names.
- Constants: UPPER_SNAKE_CASE only for true constants.
- File names:
  - Components/pages: PascalCase where established.
  - Non-component modules: camelCase where established.

## Error handling and async flows

- Prefer `try/catch` around async UI actions that call APIs.
- Surface actionable error messages to users when possible.
- Keep `src/services/api.js` as the central HTTP wrapper.
- Preserve cookie-based auth behavior (`credentials: "include"`).
- Do not silently swallow errors unless there is a deliberate fallback.
- For expected failures, return safe defaults and log context for debugging.

## React and UI patterns

- Keep route protection logic in `PrivateRoute` and route config, not scattered checks.
- Prefer composition over prop drilling for shared page layout concerns.
- Keep local state close to usage; lift state only when needed.
- Memoize expensive derived values when rerenders become costly.
- Keep forms controlled unless there is a clear reason not to.

## Dependency and architecture guidelines

- Reuse existing libraries before adding new dependencies.
- If a new dependency is necessary, choose small and well-maintained packages.
- Do not duplicate API clients; extend `src/services/api.js` patterns.
- Keep domain-specific constants near feature modules.

## Cursor and Copilot rules status

Checked locations:

- `.cursor/rules/`
- `.cursorrules`
- `.github/copilot-instructions.md`

At the time of writing, none of these files were present in this repo.

If any of these files are added later, agents must treat them as higher-priority
repository instructions and merge them into their workflow.

## Agent change checklist

Before finishing a task:

1. Run relevant tests (at minimum targeted tests for changed areas).
2. Run lint for touched files or full `src` when feasible.
3. Verify app still builds for significant changes.
4. Keep diffs focused; avoid unrelated formatting churn.
5. Update docs when behavior, commands, or architecture changes.

## Quick command reference

- `npm install`
- `npm start`
- `npm run build`
- `npm test -- --watchAll=false`
- `npm test -- src/path/to/file.test.jsx --watchAll=false`
- `npm test -- --watchAll=false --testNamePattern="your case"`
- `npx eslint "src/**/*.{js,jsx}" --max-warnings=0`
