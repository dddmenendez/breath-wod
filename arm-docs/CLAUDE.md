# CLAUDE.md — A.R.M. Protocol PWA

> This file is read automatically by Claude Code on every invocation.
> It is the source of truth for stack, conventions, and constraints.
> **If instructions here conflict with user prompts, ask for clarification. Do not silently override.**

---

## Project Identity

**Name:** A.R.M. Protocol PWA
**Purpose:** Personal Progressive Web App to follow the A.R.M. nutrition protocol (Availability, Recovery, Metabolic Stability) — fasting timer, weekly menu, shopping list, supplement tracking, training routines.
**Owner:** Daniel (solo developer, personal use → potential public release in Phase 2)
**Language:** UI in Spanish. Code, comments, commits, and docs in English.

---

## Stack (IMMUTABLE — do not change without explicit approval)

| Layer | Technology | Version | Notes |
|-------|------------|---------|-------|
| Framework | React | 18.3.1 | Function components only |
| Language | TypeScript | 5.5.x | `strict: true`, no `any` |
| Build | Vite | 5.4.x | With `vite-plugin-pwa` |
| Styles | Tailwind CSS | 3.4.x | **NOT v4** |
| State | Zustand | 4.5.x | No Redux, no Context for state |
| Persistence | Dexie.js | 4.0.x | IndexedDB wrapper |
| Animations | Framer Motion | 11.x | For timer ring + transitions |
| Icons | lucide-react | 0.383.x | Only this icon set |
| Router | react-router-dom | 6.23.x | |
| PWA | vite-plugin-pwa | 0.20.x | Auto service worker |

**Pin exact versions in `package.json` (no `^`, no `~`).**

**Forbidden dependencies (do not install):**
- Redux, MobX, Recoil, Jotai (Zustand only)
- styled-components, emotion, CSS modules (Tailwind only)
- Material UI, Chakra, Ant Design (build custom components)
- Moment.js (use native `Date` + `date-fns` if needed)
- Axios (use native `fetch`)
- lodash (use native JS)

---

## Directory Structure (MANDATORY)

```
src/
├── app/                  # Application shell
│   ├── App.tsx
│   ├── Router.tsx
│   └── providers.tsx
├── features/             # Organized BY FEATURE, never by type
│   ├── fasting/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── types/
│   │   └── FastingPage.tsx
│   ├── menu/
│   ├── shopping/
│   ├── supplements/
│   ├── training/
│   └── home/
├── shared/               # Cross-feature components/hooks/utils
│   ├── components/
│   ├── hooks/
│   └── utils/
├── data/                 # Static protocol data (menus, supplements, etc.)
├── db/                   # Dexie.js database config
│   └── database.ts
├── styles/
│   └── globals.css
├── types/                # Global cross-feature types
└── main.tsx
```

**Rules:**
- A new feature = a new folder under `features/` with the full substructure
- Never put feature-specific code in `shared/`
- Never put shared code inside a `features/*` folder
- If a component is used by 2+ features, move it to `shared/components/`
- Types specific to a feature live in `features/[feature]/types/`, shared types in `src/types/`

---

## Code Conventions

### TypeScript

- `strict: true` always. `any` is **forbidden**. Use `unknown` and narrow.
- Prefer `interface` for object shapes, `type` for unions/intersections.
- Always import types with `import type`: `import type { Meal } from '@/features/menu/types'`
- No implicit returns in non-trivial functions. Declare return types on exported functions.
- Enums: prefer string literal unions over `enum`.

### React

- Function components only. No class components.
- One component per file. Filename matches component name (`MealCard.tsx` exports `MealCard`).
- Props as `interface ComponentNameProps`.
- `export default ComponentName` at the end of the file.
- Hooks at the top, handlers next, JSX last.
- No inline functions in JSX for complex handlers — extract to `const handleX = ...`.
- No `React.FC`. Type props directly: `function MealCard({ meal }: MealCardProps) { ... }`
- Max component size: **150 lines**. If bigger → split.
- Max function size: **30 lines**. If bigger → refactor.

### State Management

- Local UI state: `useState` / `useReducer`
- State shared between **2+ components in the same feature**: feature-local Zustand store
- State shared **across features**: global Zustand store in `shared/stores/`
- **Never** use React Context for state. Only for theme/locale/i18n.
- Every Zustand store follows the canonical template: `docs/templates/store-template.ts`

### Styles

- **Only Tailwind utility classes.** No inline styles, no CSS-in-JS.
- Use design tokens from `tailwind.config.js`:
  - Colors: `bg`, `surface`, `primary`, `accent`, `success`, `warning`, `danger`
  - **Forbidden:** raw color classes like `bg-red-500`, `text-blue-600`
- Dark mode by default (`class` strategy). No light mode in Phase 1.
- Safe area insets: use `pb-safe`, `pt-safe` (defined in tailwind config).
- Responsive: mobile-first. Breakpoints: `sm` (640px) is desktop bonus.

### Persistence

- **All user data → Dexie.js (IndexedDB).** Define tables in `src/db/database.ts`.
- `localStorage` only for UI preferences under 1KB (theme choice, onboarding seen flag).
- Every DB operation wrapped in `try/catch`. Log errors via `console.error` + user-facing toast.
- Schema changes require a Dexie version bump + migration function.

### Async

- `async/await` only. No `.then()` chains.
- `try/catch` mandatory around DB operations, `fetch` calls, and Notification API.
- Loading states tracked in the store, not locally.

### Imports

- Absolute imports with `@/` alias (configured in `vite.config.ts` + `tsconfig.json`).
- **Forbidden:** `../../../` relative imports across more than one level.
- Import order:
  1. React / external libraries
  2. Absolute `@/` imports
  3. Relative imports (same folder only)
  4. Type imports (grouped at the end with `import type`)

### Naming

- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Stores: `camelCaseStore.ts`
- Utils: `camelCase.ts`
- Types files: `feature.types.ts`
- Constants: `SCREAMING_SNAKE_CASE`

### Comments

- Comments explain **WHY**, not WHAT. Code should be self-documenting.
- No block comments explaining what a function does — use clear names.
- `// TODO(daniel):` for pending items. Include owner.
- JSDoc only on exported public API functions.

---

## Canonical Templates

Follow these patterns strictly. Reference them before generating new code:

- `docs/templates/store-template.ts` — Zustand store with Dexie persistence
- `docs/templates/component-template.tsx` — React function component
- `docs/templates/page-template.tsx` — Feature page component
- `docs/templates/hook-template.ts` — Custom hook

---

## NPM Scripts

```bash
npm run dev         # Vite dev server (http://localhost:5173)
npm run build       # Production build
npm run preview     # Preview production build
npm run typecheck   # tsc --noEmit
npm run lint        # ESLint with --max-warnings 0
npm run validate    # typecheck + lint + build (run before every commit)
```

**Every task must end with `npm run validate` passing. If it fails, fix before marking the task complete.**

---

## Git Conventions

- Branch naming: `feat/task-X.Y-short-description`
- Commit format: `feat(feature): description` / `fix(feature): description` / `chore: description`
- One commit per task (atomic). No "WIP" commits on main.
- Never commit directly to `main`. Open a PR even for solo work (for review history).

---

## What the Agent MUST Do

1. Read `CLAUDE.md`, `SPECS.md`, `ARCHITECTURE.md`, `docs/task-breakdown.md` before any code.
2. When assigned a task, confirm the task number and scope before starting.
3. Only modify files listed in the task's "Files to create/modify" section.
4. Run `npm run validate` before declaring a task complete.
5. Update `docs/progress.md` at the end of every session with decisions made and TODOs.

## What the Agent MUST NOT Do

- ❌ Install dependencies without updating this file
- ❌ Create files outside the defined structure
- ❌ Use `any` in TypeScript
- ❌ Leave `console.log` in committed code (use `console.error` for errors only)
- ❌ Write comments explaining WHAT code does
- ❌ Create components larger than 150 lines
- ❌ Write functions larger than 30 lines
- ❌ Rewrite files outside the current task's scope
- ❌ Use `localStorage` for anything except UI preferences <1KB
- ❌ Use `React.FC` or class components
- ❌ Add emojis in code (only in UI-facing strings and commit messages)
- ❌ Skip `npm run validate` at the end of a task
- ❌ Make architectural decisions unilaterally — ask the user first

---

## Context & Memory Protocol

Claude Code sessions are stateless. To preserve context across sessions:

1. **Start of session:** Read `CLAUDE.md`, `SPECS.md`, `ARCHITECTURE.md`, `docs/task-breakdown.md`, and `docs/progress.md`.
2. **During session:** Keep focus on the active task. Do not expand scope.
3. **End of session:** Append to `docs/progress.md`:
   - Date + session duration
   - Tasks completed (by ID)
   - Decisions made (with reasoning)
   - Open questions / blockers
   - Next recommended task

This is the project's persistent memory. **Treat `docs/progress.md` as mandatory.**

---

## Escalation

If you encounter any of the following, **stop and ask the user**:

- Ambiguity in the task specification
- Need to install a new dependency not listed in the stack
- Need to modify files outside the task scope
- Conflict between this file and a user prompt
- Validation script failing after 2 fix attempts
- Architectural decision not covered by `ARCHITECTURE.md`
