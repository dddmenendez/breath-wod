# CLAUDE.md — A.R.M. Protocol PWA

> This file is the source of truth for AI assistants working on this codebase.
> Read automatically by Claude Code on every invocation.
> **If instructions here conflict with user prompts, ask for clarification.**

---

## Project Overview

**Name:** A.R.M. Protocol PWA (`arm-protocol-pwa`)
**Purpose:** Offline-first Progressive Web App for the A.R.M. nutrition protocol (Availability, Recovery, Metabolic Stability) — fasting timer, weekly menu, shopping list, supplement tracking.
**Owner:** Daniel (solo developer, personal use)
**Phase:** Phase 1 MVP (local-only, no auth, no backend)
**UI Language:** Spanish | **Code Language:** English

---

## Quick Reference

```bash
npm run dev         # Vite dev server → http://localhost:5173
npm run typecheck   # tsc --noEmit
npm run lint        # ESLint --max-warnings 0
npm run build       # tsc -b && vite build → /dist
npm run validate    # typecheck + lint + build (MUST pass before any commit)
npm run preview     # Preview production build locally
```

**Every task must end with `npm run validate` passing.**

---

## Tech Stack (do not change without explicit approval)

| Layer        | Technology         | Version  |
| ------------ | ------------------ | -------- |
| Framework    | React              | 18.3.1   |
| Language     | TypeScript         | 5.5.4    |
| Build        | Vite               | 5.4.2    |
| Styles       | Tailwind CSS       | 3.4.4    |
| State        | Zustand            | 4.5.2    |
| Persistence  | Dexie.js           | 4.0.8    |
| Animations   | Framer Motion      | 11.2.10  |
| Icons        | lucide-react       | 0.383.0  |
| Router       | react-router-dom   | 6.23.1   |
| PWA          | vite-plugin-pwa    | 0.20.0   |

**Pin exact versions in `package.json` — no `^`, no `~`.**

### Forbidden Dependencies

Do not install: Redux/MobX/Recoil/Jotai (Zustand only), styled-components/emotion/CSS modules (Tailwind only), Material UI/Chakra/Ant Design, Moment.js (native Date), Axios (native fetch), lodash (native JS).

---

## Directory Structure

```
breath-wod/
├── arm-docs/                 # Project documentation
│   ├── CLAUDE.md             # Legacy project conventions (see also this file)
│   ├── ARCHITECTURE.md       # Technical architecture & data flow
│   ├── SPECS.md              # Product requirements & user stories
│   └── task-breakdown.md     # Task list for development phases
├── docs/
│   └── templates/            # Canonical code templates
│       ├── store-template.ts
│       ├── component-template.tsx
│       ├── page-template.tsx
│       └── hook-template.ts
├── public/                   # Static PWA assets (icons, manifest)
├── src/
│   ├── app/                  # Application shell
│   │   ├── App.tsx           # Root: BrowserRouter + InstallBanner + Router + BottomNav
│   │   └── Router.tsx        # Route definitions (6 routes)
│   ├── features/             # Feature modules (organized BY FEATURE, not by type)
│   │   ├── fasting/          # Fasting timer: components/, hooks/, store/, types/
│   │   ├── menu/             # Weekly menu: components/, store/, types/
│   │   ├── shopping/         # Shopping list: components/, store/, types/, utils/
│   │   ├── supplements/      # Supplement tracker: components/, store/, types/
│   │   ├── home/             # Dashboard: components/
│   │   └── settings/         # Settings: components/
│   ├── shared/               # Cross-feature code
│   │   ├── components/       # Header, BottomNav, InstallBanner, ProgressRing
│   │   ├── hooks/            # useNotifications, useInstallPrompt
│   │   └── utils/            # notifications.ts, exportData.ts
│   ├── data/                 # Static protocol data
│   │   ├── defaultMenu.ts    # 7-day A.R.M. meal plan
│   │   ├── defaultSupplements.ts
│   │   ├── approvedFoods.ts  # YES/NO food lists
│   │   └── stapleItems.ts
│   ├── db/
│   │   └── database.ts       # Dexie.js database (5 tables)
│   ├── types/
│   │   └── global.types.ts   # UserPreferences
│   ├── styles/
│   │   └── globals.css       # Tailwind directives + Inter font
│   ├── main.tsx              # React root + SW registration
│   └── vite-env.d.ts
├── package.json
├── tsconfig.json             # strict: true, path alias @/* → src/*
├── vite.config.ts            # Vite + PWA + path alias
├── tailwind.config.js        # Design tokens (colors, fonts, spacing)
├── .eslintrc.cjs             # ESLint: no-any error, react-hooks, react-refresh
├── .prettierrc               # semi:false, singleQuote, trailingComma:all, printWidth:100
├── vercel.json               # SPA rewrites + SW cache headers
└── index.html
```

### Structure Rules

- New feature = new folder under `features/` with `components/`, `store/`, `types/` subfolders
- Feature-specific code never goes in `shared/`
- Shared code (2+ features) goes in `shared/`
- Feature-specific types in `features/[feature]/types/`, global types in `src/types/`
- A feature must not import from another feature's internals — use `shared/` for cross-feature needs

---

## Routes

| Path            | Page              |
| --------------- | ----------------- |
| `/`             | HomePage          |
| `/fasting`      | FastingPage       |
| `/menu`         | MenuPage          |
| `/shopping`     | ShoppingPage      |
| `/supplements`  | SupplementsPage   |
| `/settings`     | SettingsPage      |

BottomNav provides 5-tab navigation (home, fasting, menu, shopping, supplements). Settings is accessed via the Header.

---

## Architecture

### Data Flow

```
React Components → Zustand Store actions → Dexie.js (IndexedDB)
React Components ← Zustand Store selectors ← Dexie.js (IndexedDB)
```

**Components never access Dexie directly.** Always go through store actions.

### Database (Dexie v1)

Five tables in `src/db/database.ts`:
- `fasting`: `++id, startTime, status`
- `menus`: `++id, weekId, dayOfWeek`
- `shopping`: `++id, weekId, category, checked`
- `supplements`: `++id, date, supplementId, timing`
- `preferences`: `key`

Schema changes require a Dexie version bump + migration function. Never modify an existing `version(N).stores()` call.

### State Management (Zustand)

Every feature store follows this pattern:
```typescript
interface FeatureState {
  items: Item[]
  loading: boolean
  error: string | null
  load: () => Promise<void>     // Called on feature mount via useEffect
  add: (input: ItemInput) => Promise<void>
  update: (id: number, patch: Partial<Item>) => Promise<void>
  remove: (id: number) => Promise<void>
}
```

- Actions are `async` and wrap DB calls in `try/catch`
- Derived state uses selectors, not computed fields in the store
- Reference `docs/templates/store-template.ts` before creating stores

### Fasting Timer Strategy

Uses absolute timestamps, never `setInterval` counting:
```typescript
// Store startTime as Date.now(), compute elapsed = Date.now() - startTime
// This survives backgrounding, sleep, and page reloads
```

---

## Code Conventions

### TypeScript

- `strict: true` always. **`any` is forbidden** (ESLint error-level rule)
- Use `unknown` and narrow instead of `any`
- `interface` for object shapes, `type` for unions/intersections
- Always use `import type` for type-only imports
- Declare return types on exported functions
- Prefer string literal unions over `enum`

### React

- Function components only. No `React.FC`. No class components.
- Props as `interface ComponentNameProps`
- One component per file. Filename matches component name.
- `export default ComponentName` at end of file
- Hooks at top, handlers next, JSX last
- Extract complex handlers: `const handleX = ...` (no complex inline functions in JSX)
- **Max component size: 150 lines.** Split if bigger.
- **Max function size: 30 lines.** Refactor if bigger.

### Styles

- **Only Tailwind utility classes.** No inline styles, no CSS-in-JS.
- Use design tokens from `tailwind.config.js`:
  - Backgrounds: `bg-bg`, `bg-bg-surface`, `bg-bg-elevated`
  - Brand: `text-primary`, `bg-primary`, `text-accent`
  - Text: `text-text`, `text-text-muted`, `text-text-dim`
  - Status: `text-success`, `text-warning`, `text-danger`
- **Forbidden:** Raw color classes (`bg-red-500`, `text-blue-600`, `bg-slate-900`)
- Dark mode by default (`class` strategy). No light mode in Phase 1.
- Safe area insets: `pb-safe-bottom`, `pt-safe-top`
- Mobile-first. `sm` (640px) breakpoint for desktop bonus.

### Imports

- Use `@/` alias for all imports: `import { db } from '@/db/database'`
- **Forbidden:** Deep relative imports (`../../../`)
- Order: (1) React/external libs, (2) `@/` absolute imports, (3) relative imports, (4) `import type`

### Naming

| Kind        | Convention                    | Example                |
| ----------- | ----------------------------- | ---------------------- |
| Components  | `PascalCase.tsx`              | `MealCard.tsx`         |
| Hooks       | `useCamelCase.ts`             | `useFastingTimer.ts`   |
| Stores      | `camelCaseStore.ts`           | `fastingStore.ts`      |
| Utils       | `camelCase.ts`                | `exportData.ts`        |
| Types files | `feature.types.ts`            | `fasting.types.ts`     |
| Constants   | `SCREAMING_SNAKE_CASE`        | `MAX_FAST_HOURS`       |

### Persistence

- All user data goes to Dexie.js (IndexedDB)
- `localStorage` only for UI preferences under 1KB (e.g., `arm-install-dismissed`)
- Every DB operation in `try/catch` with `console.error` on failure
- Schema changes = Dexie version bump + migration

### Async

- `async/await` only — no `.then()` chains
- `try/catch` mandatory around DB operations, fetch calls, Notification API
- Loading states tracked in the store, not locally

### Formatter (Prettier)

- No semicolons (`semi: false`)
- Single quotes
- Trailing commas everywhere
- 100 char print width
- 2 space indentation

---

## Git Conventions

- Branch naming: `feat/task-X.Y-short-description`
- Commit format: `feat(feature): description` / `fix(feature): description` / `chore: description`
- Atomic commits — one logical change per commit
- Never commit `console.log` (use `console.error` for errors only)

---

## Deployment

- **Hosting:** Vercel (configured via `vercel.json`)
- SPA routing: all paths rewrite to `/index.html` (except assets, sw.js, manifest)
- Service worker (`/sw.js`) served with `no-cache` headers
- No environment variables needed in Phase 1

---

## Documentation Files

For deeper context, read these in `arm-docs/`:

| File                  | Contents                                             |
| --------------------- | ---------------------------------------------------- |
| `ARCHITECTURE.md`     | Data flow, DB schema, feature module design, PWA config |
| `SPECS.md`            | Product vision, A.R.M. protocol domain knowledge, user stories |
| `task-breakdown.md`   | Development task list and phasing                    |

Canonical code templates live in `docs/templates/`:
- `store-template.ts` — Zustand store with Dexie persistence
- `component-template.tsx` — React function component
- `page-template.tsx` — Feature page component
- `hook-template.ts` — Custom hook

**Reference templates before generating new code.**

---

## Do's and Don'ts

### Always Do

- Run `npm run validate` before declaring any task complete
- Read relevant docs (`ARCHITECTURE.md`, `SPECS.md`) before making architectural decisions
- Follow canonical templates in `docs/templates/`
- Use `@/` import alias
- Wrap DB operations in `try/catch`
- Use design tokens for colors (never raw Tailwind colors)

### Never Do

- Use `any` in TypeScript
- Install dependencies not listed in the stack without approval
- Leave `console.log` in committed code
- Use `localStorage` for anything except tiny UI preferences
- Use `React.FC` or class components
- Create components larger than 150 lines or functions larger than 30 lines
- Import directly from another feature's internals
- Write comments explaining WHAT code does (explain WHY)
- Skip `npm run validate`
- Make architectural decisions unilaterally — ask first

### Escalate to the User When

- The task specification is ambiguous
- A new dependency is needed
- Files outside the task scope need modification
- Validation fails after 2 fix attempts
- An architectural decision isn't covered by existing documentation
