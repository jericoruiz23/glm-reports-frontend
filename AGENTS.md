# AGENTS.md

Guidance for agentic coding assistants operating in this repository.

## Scope and precedence
- This file applies to the entire repo.
- If a deeper AGENTS.md is added, it overrides this file for that subtree.
- User instructions in the active task always override AGENTS.md.

## Cursor and Copilot rules
- Checked `.cursor/rules/` and `.cursorrules`: no files found.
- Checked `.github/copilot-instructions.md`: file not present.
- If these files are added later, treat them as high-priority instructions and merge with this guide.

## Project snapshot
- Stack: React 19 + Create React App (`react-scripts`).
- Language: JavaScript/JSX (no TypeScript config).
- UI: MUI + some CSS modules.
- Routing: `react-router-dom` with metadata in `src/routes/routesConfig.js`.
- State: hooks + context (`src/context/AuthContext.jsx`).
- API: centralized wrapper in `src/services/api.js`, cookie-based auth.
- Testing: Jest + React Testing Library via `react-scripts test`.

## Environment and setup
- Package manager: npm (`package-lock.json` exists).
- Required env var: `REACT_APP_API_URL` (see `.env`).
- Auth depends on cookies (`credentials: "include"`), not bearer tokens.
- Prefer `npm ci` for reproducible installs.

## Build, lint, and test commands

### Install / start
- Install: `npm ci`
- Dev server: `npm start`

### Build
- Production build: `npm run build`
- Output folder: `build/`
- Build currently succeeds with existing lint warnings (see baseline warnings).

### Test
- All tests (watch): `npm test`
- All tests (single run): `npm test -- --watchAll=false`
- Single test file: `npm test -- --watchAll=false src/hooks/useProcesses.test.js`
- Single test by name: `npm test -- --watchAll=false --testNamePattern="logout limpia estado aun si falla la llamada"`
- Coverage run: `npm test -- --watchAll=false --coverage`
- Optional stability flag for flaky local runs: add `--runInBand`.

### Lint
- There is no `npm run lint` script in `package.json`.
- Lint source: `npx eslint "src/**/*.{js,jsx}"`
- Strict lint (fails on warnings): `npx eslint "src/**/*.{js,jsx}" --max-warnings=0`

## Baseline warnings to know
- `src/components/Modals/InitialProcess/ModalCreateInProcess.jsx`: `no-unused-vars` (`extensiones`).
- `src/components/Modals/InitialProcess/ModalEditInProcess.jsx`: `react-hooks/exhaustive-deps` (`formatUTCDate`).
- Test output includes expected `console.error` logs in negative-path tests.
- CRA tooling may print `baseline-browser-mapping` staleness notices.

## Repository layout
- `src/pages/`: page-level screens.
- `src/components/`: reusable UI and modal flows.
- `src/hooks/`: reusable data/domain hooks.
- `src/services/`: API/service layer.
- `src/context/`: shared context state.
- `src/routes/`: route guards and route config.
- `src/utils/`: pure helpers and transformers.

## Code style and implementation guidelines

### 1) Imports
- Keep import groups ordered: external packages -> internal modules -> styles/assets.
- Use one blank line between groups.
- Prefer named imports when practical.
- Keep relative paths consistent with nearby files (no new alias system unless requested).

### 2) Formatting
- Use semicolons.
- Prefer double quotes.
- Keep trailing commas in multiline literals/calls.
- Preserve the surrounding file's indentation style (repo has both 2-space and 4-space legacy areas).
- Avoid broad reformatting in files unrelated to your change.

### 3) Types and data contracts (JS codebase)
- Do not introduce TypeScript unless explicitly requested.
- Use JSDoc sparingly for complex payloads or service methods.
- Guard unknown backend response shapes defensively (pattern in `processService`).
- Use optional chaining and nullish coalescing for nullable data.

### 4) Naming conventions
- Components: PascalCase file and symbol names (e.g., `ManageTimes.jsx`).
- Hooks: `useX` camelCase in `src/hooks`.
- Services: camelCase service objects with verb methods (`list`, `getById`, `create`, `update`).
- Constants: `UPPER_SNAKE_CASE` for immutable maps/tables.
- Variables/functions: camelCase.
- Preserve established domain terms, including Spanish business names.

### 5) React component patterns
- Prefer functional components.
- Keep side effects in `useEffect` with clear dependency arrays.
- Wrap async effect logic in inner async functions.
- Use `useCallback` when callbacks are reused or passed as props.
- Extract reusable logic to hooks/utilities instead of duplicating in components.

### 6) Services and API usage
- Prefer calling `src/services/*Service.js` from hooks/pages.
- Prefer `src/services/api.js` over direct `fetch` for new work.
- Keep cookie auth behavior (`credentials: "include"`) intact.
- Let service layer throw enriched errors; handle UI feedback in hooks/components.
- Add new endpoint integrations in service files, not scattered across view files.

### 7) Error handling
- Do not silently swallow request errors in services.
- In UI/hooks, catch errors to set fallback state and notify users (`toast.error` pattern).
- Keep diagnostic logs concise (`console.error`) where useful.
- Return safe fallbacks (`[]`, `null`, guarded render paths) when failures occur.

### 8) State and render logic
- Keep loading/error/data state explicit for async flows.
- Prefer derived values in hooks or small helpers for readability.
- Keep list/table keys stable (`_id` first, index only as fallback).
- Avoid deeply nested JSX transformations when they reduce clarity.

### 9) Styling
- Follow local style strategy used in the touched area (MUI props vs CSS module).
- Avoid introducing a new global styling paradigm in unrelated files.
- Keep style changes targeted; avoid large visual rewrites unless requested.

### 10) Testing conventions
- Co-locate tests as `*.test.js` / `*.test.jsx` near implementation files.
- Use React Testing Library primitives: `render`, `screen`, `waitFor`, `renderHook`.
- Mock service/context dependencies with top-level `jest.mock`.
- Reset mocks in `beforeEach` with `jest.clearAllMocks()`.
- Assert behavior and user-visible outcomes over implementation internals.

## Agent change discipline
- Keep diffs minimal and focused.
- Do not rename/move files without clear necessity.
- Do not mix broad refactors with feature/bugfix changes.
- Keep comments only where logic is not obvious.
- Preserve existing UI language and domain wording unless asked to rewrite copy.

## Suggested done checklist
- Run targeted tests for touched modules.
- Run full tests if shared hooks/context/routes/services are changed.
- Run lint for touched scope (or full `src` when practical).
- Run `npm run build` for larger changes before handoff.
- Distinguish pre-existing warnings from new regressions in your report.
