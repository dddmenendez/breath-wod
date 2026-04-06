# Task Breakdown — A.R.M. Protocol PWA (Phase 1 MVP)

> Atomic tasks for Claude Code agents. Execute in order.
> Each task has: precondition, scope, files, acceptance criteria.
> **Do not start a task unless its precondition is met.**
> **Do not modify files outside the task's scope.**

---

## Milestone 1 — Foundation

### Task 1.1: Initialize Vite + React + TypeScript project

**Precondition:** Empty repository with `CLAUDE.md`, `SPECS.md`, `ARCHITECTURE.md`, `docs/task-breakdown.md`.

**Scope:** Scaffold the base project using `npm create vite@latest` with the `react-ts` template. Pin exact versions of all dependencies in `package.json` (no `^`, no `~`).

**Files to create:**
- `package.json` (with pinned versions)
- `tsconfig.json` (strict mode, `@/` path alias)
- `tsconfig.node.json`
- `vite.config.ts` (with `@/` alias)
- `index.html`
- `src/main.tsx`
- `src/App.tsx` (placeholder: "A.R.M. Protocol")
- `.gitignore`
- `.eslintrc.cjs`
- `.prettierrc`

**Acceptance criteria:**
- `npm install` completes without errors
- `npm run dev` serves at `http://localhost:5173`
- Browser shows "A.R.M. Protocol" text
- `npm run typecheck` passes
- `npm run lint` passes with zero warnings

---

### Task 1.2: Install and configure Tailwind CSS v3

**Precondition:** Task 1.1 completed.

**Scope:** Install Tailwind v3 (NOT v4). Configure design tokens per `ARCHITECTURE.md` §8. Set up dark mode as class strategy. Import Inter font.

**Files to create:**
- `tailwind.config.js`
- `postcss.config.js`
- `src/styles/globals.css`

**Files to modify:**
- `src/main.tsx` (import globals.css, add `<html class="dark">`)
- `index.html` (link Inter font from Google Fonts)

**Acceptance criteria:**
- A test `<div className="bg-bg text-primary">` renders with correct colors
- `dark:` variant works
- `npm run validate` passes

---

### Task 1.3: Configure vite-plugin-pwa

**Precondition:** Task 1.2 completed.

**Scope:** Install and configure `vite-plugin-pwa` per `ARCHITECTURE.md` §7. Create placeholder icons (use solid color SVG converted to PNG).

**Files to create:**
- `public/icons/icon-192.png`
- `public/icons/icon-512.png`
- `public/icons/icon-maskable-512.png`

**Files to modify:**
- `vite.config.ts` (add VitePWA plugin with manifest)
- `src/main.tsx` (register SW via virtual module)

**Acceptance criteria:**
- `npm run build` produces `dist/sw.js` and `dist/manifest.webmanifest`
- `npm run preview` serves the built app
- Chrome DevTools → Application → Manifest shows A.R.M. Protocol with icons
- Lighthouse PWA audit shows "Installable" ✓

---

### Task 1.4: Install core dependencies and configure aliases

**Precondition:** Task 1.3 completed.

**Scope:** Install Zustand, Dexie, Framer Motion, React Router, Lucide React with exact pinned versions.

**Files to modify:**
- `package.json`

**Commands:**
```bash
npm install --save-exact \
  zustand@4.5.2 \
  dexie@4.0.8 \
  dexie-react-hooks@1.1.7 \
  framer-motion@11.2.10 \
  react-router-dom@6.23.1 \
  lucide-react@0.383.0
```

**Acceptance criteria:**
- All versions in `package.json` are exact (no prefix)
- `npm run typecheck` passes
- No peer dependency warnings

---

### Task 1.5: Create database layer (Dexie.js)

**Precondition:** Task 1.4 completed.

**Scope:** Create `src/db/database.ts` with the schema defined in `ARCHITECTURE.md` §3. Define all tables for Phase 1 with empty type imports (types come from each feature folder, created later as placeholders).

**Files to create:**
- `src/db/database.ts`
- `src/types/global.types.ts` (UserPreferences type)
- `src/features/fasting/types/fasting.types.ts` (FastingSession type)
- `src/features/menu/types/menu.types.ts` (DayMenu, Meal, Ingredient types)
- `src/features/shopping/types/shopping.types.ts` (ShoppingItem type)
- `src/features/supplements/types/supplement.types.ts` (SupplementLog type)

**Acceptance criteria:**
- `db.fasting`, `db.menus`, `db.shopping`, `db.supplements`, `db.preferences` are all typed tables
- A smoke test in `main.tsx` adds a dummy record and retrieves it successfully
- Remove the smoke test before committing
- `npm run validate` passes

---

### Task 1.6: Set up routing and app shell

**Precondition:** Task 1.5 completed.

**Scope:** Create the app shell with React Router. Five empty placeholder pages (Home, Fasting, Menu, Shopping, Supplements). Bottom navigation bar with Lucide icons.

**Files to create:**
- `src/app/App.tsx`
- `src/app/Router.tsx`
- `src/shared/components/BottomNav.tsx`
- `src/shared/components/Header.tsx`
- `src/features/home/HomePage.tsx` (placeholder)
- `src/features/fasting/FastingPage.tsx` (placeholder)
- `src/features/menu/MenuPage.tsx` (placeholder)
- `src/features/shopping/ShoppingPage.tsx` (placeholder)
- `src/features/supplements/SupplementsPage.tsx` (placeholder)

**Files to modify:**
- `src/main.tsx` (mount App)

**Acceptance criteria:**
- Navigation between all 5 pages works via bottom nav
- Active tab is visually highlighted
- Bottom nav respects safe-area-inset-bottom
- `npm run validate` passes

---

### Task 1.7: Create canonical templates

**Precondition:** Task 1.6 completed.

**Scope:** Create template files in `docs/templates/` that future tasks will reference. These are reference patterns, not executable code.

**Files to create:**
- `docs/templates/store-template.ts`
- `docs/templates/component-template.tsx`
- `docs/templates/page-template.tsx`
- `docs/templates/hook-template.ts`

**Acceptance criteria:**
- Each template is fully typed and would pass `tsc` if placed in `src/`
- Each template has a header comment: `// CANONICAL TEMPLATE — copy and adapt.`
- Templates reflect the conventions in `CLAUDE.md`

---

## Milestone 2 — Fasting Timer

### Task 2.1: Create fasting store with Dexie persistence

**Precondition:** Task 1.7 completed.

**Scope:** Implement the Zustand store for fasting per the template. Actions: `startFast`, `breakFast`, `loadCurrent`, `loadHistory`, `computeStreak`.

**Files to create:**
- `src/features/fasting/store/fastingStore.ts`

**Acceptance criteria:**
- `startFast(targetHours)` creates a DB record and updates state
- `breakFast()` sets endTime, computes duration, updates status
- `loadHistory()` returns last 30 records sorted by date
- `computeStreak()` counts consecutive completed fasts from most recent
- All actions wrap DB calls in try/catch and set error state on failure
- `npm run validate` passes

---

### Task 2.2: Build ProgressRing shared component

**Precondition:** Task 2.1 completed.

**Scope:** Create a reusable SVG circular progress ring. Props: `progress` (0-1), `size`, `strokeWidth`, `color`. Animated with Framer Motion.

**Files to create:**
- `src/shared/components/ProgressRing.tsx`

**Acceptance criteria:**
- Renders a smooth circular arc that fills based on `progress`
- Supports any size prop (default 280px)
- Animates smoothly when `progress` changes (300ms ease-out)
- Fully responsive (scales with parent)

---

### Task 2.3: Build FastingTimer component

**Precondition:** Task 2.2 completed.

**Scope:** The main timer view. Uses `ProgressRing` + computes elapsed time from absolute timestamps per `ARCHITECTURE.md` §6. Displays hours/minutes remaining and percentage progress.

**Files to create:**
- `src/features/fasting/components/FastingTimer.tsx`
- `src/features/fasting/hooks/useFastingTimer.ts`

**Acceptance criteria:**
- Timer updates every second via `setInterval(() => setNow(Date.now()), 1000)`
- Time calculation uses absolute timestamps (not tick counting)
- Shows "XXh YYm restantes" when active
- Shows "¡Objetivo alcanzado!" when elapsed >= target
- Survives a page reload (continues from correct state)

---

### Task 2.4: Build FastingControls component

**Precondition:** Task 2.3 completed.

**Scope:** Start/break fast buttons + target duration selector (14h / 15h / 16h / 32h).

**Files to create:**
- `src/features/fasting/components/FastingControls.tsx`

**Acceptance criteria:**
- When no active fast: shows "Empezar ayuno" button + duration selector
- When active fast: shows "Romper ayuno" button (red, destructive)
- Confirmation modal before breaking a fast that hasn't reached target
- Updates the store on click

---

### Task 2.5: Build FastingStreak + FastingHistory components

**Precondition:** Task 2.4 completed.

**Scope:** Display the current streak as a badge. Display the last 30 days as a calendar grid with colored cells (green = completed, red = broken, gray = no record).

**Files to create:**
- `src/features/fasting/components/FastingStreak.tsx`
- `src/features/fasting/components/FastingHistory.tsx`

**Acceptance criteria:**
- Streak shows correctly (e.g., "🔥 7 días")
- Calendar shows last 30 days with correct coloring
- Tapping a day shows that day's fast details in a modal

---

### Task 2.6: Assemble FastingPage + wire notifications

**Precondition:** Task 2.5 completed.

**Scope:** Compose the full FastingPage from its components. Implement notification scheduling via `src/shared/utils/notifications.ts`. Request permission on first use.

**Files to create:**
- `src/shared/utils/notifications.ts`
- `src/shared/hooks/useNotifications.ts`

**Files to modify:**
- `src/features/fasting/FastingPage.tsx`
- `src/features/fasting/store/fastingStore.ts` (schedule notifications on startFast)

**Acceptance criteria:**
- Opening `/fasting` shows the full UI
- Starting a fast schedules a notification 30 min before target and one at target
- Permission prompt appears only on first use
- `npm run validate` passes
- Manual test: start a 1-minute fast (temporarily), verify notifications fire

---

## Milestone 3 — Weekly Menu

### Task 3.1: Seed default menu data

**Precondition:** Milestone 2 completed.

**Scope:** Create the static data file with the 7-day protocol menu from `SPECS.md` §2. Structured as `DayMenu[]` with full ingredient details.

**Files to create:**
- `src/data/defaultMenu.ts`
- `src/data/approvedFoods.ts` (YES/NO lists from the protocol)

**Acceptance criteria:**
- `defaultMenu` exports an array of 7 `DayMenu` objects
- Each day has: bone broth (morning), meal1, meal2
- Every ingredient has name, amount, unit, category
- Types match `src/features/menu/types/menu.types.ts`

---

### Task 3.2: Create menu store

**Precondition:** Task 3.1 completed.

**Scope:** Zustand store that loads the default menu into Dexie on first run, tracks meal completion (boolean per meal), exposes current week + day selectors.

**Files to create:**
- `src/features/menu/store/menuStore.ts`

**Acceptance criteria:**
- On first load: seeds `db.menus` from `defaultMenu.ts`
- `toggleMealCompleted(weekId, dayOfWeek, mealType)` updates DB
- Selectors: `getTodayMenu()`, `getWeekMenu(weekId)`
- `npm run validate` passes

---

### Task 3.3: Build MealCard + MealDetail components

**Precondition:** Task 3.2 completed.

**Scope:** A collapsible card showing meal name + tags. Expanding shows ingredients list with amounts and prep instructions.

**Files to create:**
- `src/features/menu/components/MealCard.tsx`
- `src/features/menu/components/MealDetail.tsx`
- `src/features/menu/components/DigestProtocol.tsx` (reminder banner)

**Acceptance criteria:**
- Card shows meal name, tags (protein/carb/fat), and completion checkbox
- Tapping expands/collapses with Framer Motion animation
- Expanded view lists all ingredients with amounts
- Checkbox toggles completion in the store

---

### Task 3.4: Build WeeklyMenu + DailyView

**Precondition:** Task 3.3 completed.

**Scope:** Two view modes: weekly (all 7 days scrollable) and daily (just today).

**Files to create:**
- `src/features/menu/components/WeeklyMenu.tsx`
- `src/features/menu/components/DailyView.tsx`

**Files to modify:**
- `src/features/menu/MenuPage.tsx` (toggle between views)

**Acceptance criteria:**
- Page has a toggle: "Hoy" / "Semana"
- "Hoy" shows only today's meals (based on `new Date().getDay()`)
- "Semana" shows all 7 days
- Today's meals are visually highlighted in week view
- `npm run validate` passes

---

## Milestone 4 — Shopping List

### Task 4.1: Create staple items data + shopping list generator

**Precondition:** Milestone 3 completed.

**Scope:** Utility that takes a week's menus, aggregates all ingredients, sums duplicates, adds staple items, and returns a categorized `ShoppingItem[]`.

**Files to create:**
- `src/data/stapleItems.ts`
- `src/features/shopping/utils/generateList.ts`

**Acceptance criteria:**
- `generateShoppingList(menus: DayMenu[]): ShoppingItem[]` returns a correct aggregated list
- Duplicate ingredients are summed (e.g., 7 days × 3 eggs = 21 eggs)
- Staples are appended with `isStaple: true`
- Items are grouped by category in the output
- Unit tests (in code comments) verify a sample case

---

### Task 4.2: Create shopping store

**Precondition:** Task 4.1 completed.

**Scope:** Zustand store. Actions: `generateFromMenu`, `toggleChecked`, `addManualItem`, `removeItem`, `clearWeek`.

**Files to create:**
- `src/features/shopping/store/shoppingStore.ts`

**Acceptance criteria:**
- `generateFromMenu(weekId)` populates the store and DB
- Items persist across page reloads
- Checked state is preserved
- `npm run validate` passes

---

### Task 4.3: Build shopping list UI

**Precondition:** Task 4.2 completed.

**Scope:** List grouped by category with collapsible sections. Checkbox per item. Share button using Web Share API with clipboard fallback.

**Files to create:**
- `src/features/shopping/components/ShoppingList.tsx`
- `src/features/shopping/components/ShoppingCategory.tsx`
- `src/features/shopping/components/ShoppingItem.tsx`
- `src/features/shopping/components/ShareButton.tsx`

**Files to modify:**
- `src/features/shopping/ShoppingPage.tsx`

**Acceptance criteria:**
- List shows all categories with correct icons
- Checking an item strikes it through visually
- Share button copies a plain-text version of the list
- Empty state shows "Genera la lista desde el menú" with action button
- `npm run validate` passes

---

## Milestone 5 — Supplements

### Task 5.1: Seed default supplements + create store

**Precondition:** Milestone 4 completed.

**Scope:** Static data with the default supplements from `SPECS.md` §2. Zustand store tracks daily logs.

**Files to create:**
- `src/data/defaultSupplements.ts`
- `src/features/supplements/store/supplementStore.ts`

**Acceptance criteria:**
- `defaultSupplements` includes: creatine (×2), magnesium, bicarb, epsom, shilajit, bee bread
- Store seeds today's log on first load of the day
- `toggleTaken(supplementId)` updates the DB
- `getAdherence(days: number)` returns % taken over last N days

---

### Task 5.2: Build supplement UI

**Precondition:** Task 5.1 completed.

**Scope:** Daily checklist grouped by timing (morning, pre-workout, post-workout, night, weekly). Info modal on tap. Adherence chart.

**Files to create:**
- `src/features/supplements/components/SupplementTracker.tsx`
- `src/features/supplements/components/SupplementCard.tsx`
- `src/features/supplements/components/SupplementInfo.tsx`
- `src/features/supplements/components/AdherenceChart.tsx`

**Files to modify:**
- `src/features/supplements/SupplementsPage.tsx`

**Acceptance criteria:**
- Supplements grouped by timing with icons
- Checkbox toggles taken status
- Info modal shows purpose, dose, notes
- Adherence bar shows last 7 days % with color (green >80%, yellow 50-80%, red <50%)
- `npm run validate` passes

---

## Milestone 6 — Home Dashboard + Data Management

### Task 6.1: Build HomePage dashboard

**Precondition:** Milestone 5 completed.

**Scope:** The default landing page. Shows today summary: fasting state, next meal, pending supplements, quick action buttons.

**Files to create:**
- `src/features/home/components/TodaySummary.tsx`
- `src/features/home/components/QuickActions.tsx`
- `src/features/home/components/StreakBanner.tsx`

**Files to modify:**
- `src/features/home/HomePage.tsx`

**Acceptance criteria:**
- Shows active fast status (or "Empezar ayuno" button if none)
- Shows next meal with countdown
- Shows pending supplements for the current time of day
- Quick action buttons navigate to respective pages
- `npm run validate` passes

---

### Task 6.2: Implement export/import

**Precondition:** Task 6.1 completed.

**Scope:** Settings page with export/import buttons. Export downloads a JSON file. Import validates and replaces all data.

**Files to create:**
- `src/features/settings/SettingsPage.tsx`
- `src/features/settings/components/DataManagement.tsx`
- `src/shared/utils/exportData.ts`

**Files to modify:**
- `src/app/Router.tsx` (add /settings route)
- `src/shared/components/Header.tsx` (add settings icon)

**Acceptance criteria:**
- Export downloads `arm-backup-YYYY-MM-DD.json` with all data
- Import validates version and schema before writing
- Error messages are clear if import fails
- Confirmation modal before overwriting existing data
- `npm run validate` passes

---

### Task 6.3: Install prompt + final polish

**Precondition:** Task 6.2 completed.

**Scope:** Handle PWA install prompt. Polish responsive edges. Run Lighthouse. Fix any accessibility issues.

**Files to create:**
- `src/shared/hooks/useInstallPrompt.ts`
- `src/shared/components/InstallBanner.tsx`

**Acceptance criteria:**
- Install banner appears on first visit (dismissible)
- Lighthouse PWA score ≥ 90
- Lighthouse Accessibility score ≥ 90
- Tested on real mobile device (Chrome Android + Safari iOS)
- `npm run validate` passes

---

### Task 6.4: Deploy to Vercel

**Precondition:** Task 6.3 completed.

**Scope:** Configure Vercel deployment. Connect GitHub repo. Deploy to production.

**Files to create:**
- `vercel.json` (if needed for SPA routing)

**Acceptance criteria:**
- Production URL is live
- PWA installs on mobile from the URL
- Service worker caches assets
- All features work offline after first visit

---

## Progress Tracking

At the end of every session, the agent MUST append to `docs/progress.md`:

```markdown
## Session YYYY-MM-DD HH:MM

**Duration:** Xh Ym
**Agent:** [which subagent]
**Tasks completed:** Task X.Y, Task X.Z
**Tasks blocked:** Task X.W — reason
**Decisions:**
- [Decision and reasoning]
**Open questions for Daniel:**
- [Questions]
**Next recommended task:** Task X.Y+1
```

---

## Rules Recap

1. **Execute tasks in order.** Do not skip.
2. **Only touch files in the task's scope.** Ask if you need to modify anything else.
3. **Run `npm run validate` before declaring a task complete.** If it fails, fix or stop.
4. **Commit per task.** Format: `feat(milestone-N): Task X.Y — description`
5. **Update `docs/progress.md` at end of session.**
6. **If blocked, stop and ask.** Do not guess architectural decisions.
