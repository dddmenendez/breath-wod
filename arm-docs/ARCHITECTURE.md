# ARCHITECTURE.md — A.R.M. Protocol PWA

> Technical architecture and design decisions. Read after `SPECS.md`.
> If `ARCHITECTURE.md` conflicts with `CLAUDE.md`, `CLAUDE.md` wins.

---

## 1. Architectural Principles

1. **Offline-first.** The app must work with zero network. Network is a bonus, not a requirement.
2. **Local-first data.** User data lives in the device. Sync is a Phase 3 feature.
3. **Feature-based organization.** Code is grouped by domain feature, not by technical layer.
4. **Single source of truth.** Every piece of state has one owner (Zustand store or React local state).
5. **Explicit over implicit.** Named exports, explicit types, no magic.
6. **Minimal surface area.** Fewer dependencies. Fewer abstractions. Ship the simplest thing that works.

---

## 2. Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                         UI Layer                              │
│           React Components (features/*/components/)          │
└──────────────────────────┬───────────────────────────────────┘
                           │ reads/writes
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                      State Layer                             │
│            Zustand Stores (features/*/store/)                 │
│      - Holds in-memory app state                              │
│      - Exposes actions for components                         │
│      - Orchestrates persistence calls                         │
└──────────────────────────┬───────────────────────────────────┘
                           │ async CRUD
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                   Persistence Layer                          │
│                  Dexie.js (src/db/database.ts)                │
│      - Single database instance                              │
│      - Typed tables                                          │
│      - Migrations via version bumps                          │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
                  IndexedDB (browser)
```

**Rule:** Components **never** access Dexie directly. They call store actions, which call Dexie.

---

## 3. Database Schema (Dexie v1)

```typescript
// src/db/database.ts

import Dexie, { Table } from 'dexie';
import type { FastingSession } from '@/features/fasting/types/fasting.types';
import type { DayMenu } from '@/features/menu/types/menu.types';
import type { ShoppingItem } from '@/features/shopping/types/shopping.types';
import type { SupplementLog } from '@/features/supplements/types/supplement.types';
import type { UserPreferences } from '@/types/global.types';

class ARMDatabase extends Dexie {
  fasting!: Table<FastingSession, number>;
  menus!: Table<DayMenu, number>;
  shopping!: Table<ShoppingItem, number>;
  supplements!: Table<SupplementLog, number>;
  preferences!: Table<UserPreferences, string>;

  constructor() {
    super('arm-protocol');
    this.version(1).stores({
      fasting: '++id, startTime, status',
      menus: '++id, weekId, dayOfWeek',
      shopping: '++id, weekId, category, checked',
      supplements: '++id, date, supplementId, timing',
      preferences: 'key',
    });
  }
}

export const db = new ARMDatabase();
```

**Migration policy:** Any schema change bumps the Dexie version and adds an `upgrade` callback. Never modify an existing `version(N).stores()` call.

---

## 4. Feature Modules

Each feature is a self-contained module under `src/features/[feature]/`:

```
features/fasting/
├── components/           # UI pieces
│   ├── FastingTimer.tsx
│   ├── FastingControls.tsx
│   ├── FastingProgress.tsx
│   ├── FastingHistory.tsx
│   └── FastingStreak.tsx
├── hooks/                # Feature-specific hooks
│   └── useFastingTimer.ts
├── store/                # Zustand store
│   └── fastingStore.ts
├── types/                # TypeScript types
│   └── fasting.types.ts
└── FastingPage.tsx       # Top-level page component
```

**Import rules:**
- A feature may import from `shared/`, `data/`, `db/`, `types/`
- A feature **must not** import from another feature's internals
- Cross-feature needs go through `shared/` or global stores

---

## 5. State Management Pattern

Every Zustand store follows this exact shape (see `docs/templates/store-template.ts`):

```typescript
interface FeatureState {
  // --- Data (what the UI reads) ---
  items: Item[];
  loading: boolean;
  error: string | null;

  // --- Actions (what the UI calls) ---
  load: () => Promise<void>;
  add: (input: ItemInput) => Promise<void>;
  update: (id: number, patch: Partial<Item>) => Promise<void>;
  remove: (id: number) => Promise<void>;
}
```

Rules:
- Actions are `async` and return `Promise<void>`.
- Actions wrap DB calls in `try/catch` and set `error` on failure.
- The `load` action is called on feature mount via `useEffect`.
- Derived state uses selectors, not computed fields in the store.

---

## 6. Fasting Timer — The Critical Piece

The fasting timer is the hardest component. It must:

1. Work in the background (device sleep, app closed, browser minimized).
2. Survive page reloads without losing state.
3. Display smoothly without rerendering every second.
4. Trigger notifications at target time.

### Strategy: Absolute Timestamps

**Never** use `setInterval` to count down. Store the start timestamp and compute elapsed time on each render.

```typescript
// ❌ WRONG
const [remaining, setRemaining] = useState(targetHours * 3600);
useEffect(() => {
  const id = setInterval(() => setRemaining(r => r - 1), 1000);
  return () => clearInterval(id);
}, []);

// ✅ RIGHT
const startTime = fastingSession.startTime.getTime();
const targetMs = targetHours * 3600 * 1000;

const [now, setNow] = useState(Date.now());
useEffect(() => {
  const id = setInterval(() => setNow(Date.now()), 1000);
  return () => clearInterval(id);
}, []);

const elapsed = now - startTime;
const remaining = Math.max(0, targetMs - elapsed);
```

This survives backgrounding because the computation is based on wall-clock time, not tick counting.

### Notifications

Scheduled notifications use the service worker. When a fast starts, the store schedules two timers via `setTimeout` **and** stores the target timestamps in IndexedDB. On service worker activation, pending notifications are rescheduled from the DB (in case the SW was killed).

---

## 7. PWA Configuration

### Manifest (`vite.config.ts`)

```typescript
VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'A.R.M. Protocol',
    short_name: 'A.R.M.',
    description: 'Nutrición, ayuno y entrenamiento para rendimiento',
    theme_color: '#0f172a',
    background_color: '#0f172a',
    display: 'standalone',
    orientation: 'portrait',
    start_url: '/',
    lang: 'es',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    cleanupOutdatedCaches: true,
  },
});
```

### Service Worker Strategy

- **App shell:** precached on install.
- **Assets (fonts, icons):** Cache First.
- **API calls:** None in Phase 1. Phase 3 will use Network First with stale-while-revalidate.

---

## 8. Design Tokens (Tailwind)

Defined once in `tailwind.config.js`. Components use only these tokens.

```javascript
// tailwind.config.js (excerpt)

theme: {
  extend: {
    colors: {
      bg: {
        DEFAULT: '#0f172a',   // slate-900 — main background
        surface: '#1e293b',   // slate-800 — cards, modals
        elevated: '#334155',  // slate-700 — elevated surfaces
      },
      primary: {
        DEFAULT: '#84cc16',   // lime-500 — main accent (vitality)
        dark: '#65a30d',
        light: '#a3e635',
      },
      accent: {
        DEFAULT: '#f59e0b',   // amber-500 — energy, warmth
        dark: '#d97706',
      },
      text: {
        DEFAULT: '#f1f5f9',   // slate-100
        muted: '#94a3b8',     // slate-400
        dim: '#64748b',       // slate-500
      },
      success: '#22c55e',
      warning: '#eab308',
      danger: '#ef4444',
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
    spacing: {
      'safe-top': 'env(safe-area-inset-top)',
      'safe-bottom': 'env(safe-area-inset-bottom)',
    },
  },
},
darkMode: 'class',
```

Components use `bg-bg`, `bg-bg-surface`, `text-text`, `text-primary`, etc. **Never** `bg-slate-900` directly.

---

## 9. Routing

```typescript
// src/app/Router.tsx

const routes = [
  { path: '/',            element: <HomePage /> },
  { path: '/fasting',     element: <FastingPage /> },
  { path: '/menu',        element: <MenuPage /> },
  { path: '/shopping',    element: <ShoppingPage /> },
  { path: '/supplements', element: <SupplementsPage /> },
  { path: '/settings',    element: <SettingsPage /> },
  { path: '*',            element: <NotFoundPage /> },
];
```

Layout shell (`App.tsx`) renders `<BottomNav>` on all routes except onboarding.

---

## 10. Notifications

Single abstraction in `src/shared/utils/notifications.ts`:

```typescript
export async function requestNotificationPermission(): Promise<boolean> { ... }
export async function scheduleNotification(opts: { title, body, at: Date }): Promise<void> { ... }
export async function cancelScheduledNotification(id: string): Promise<void> { ... }
```

Components and stores never touch the Notification API directly.

---

## 11. Export / Import

Defined in `src/shared/utils/exportData.ts`:

```typescript
interface BackupFile {
  version: 1;
  exportDate: string;  // ISO
  fasting: FastingSession[];
  menus: DayMenu[];
  shopping: ShoppingItem[];
  supplements: SupplementLog[];
  preferences: UserPreferences[];
}

export async function exportToJson(): Promise<void> { ... }
export async function importFromJson(file: File): Promise<ImportResult> { ... }
```

- Export triggers a file download with filename `arm-backup-YYYY-MM-DD.json`.
- Import validates the schema version before writing. Mismatched versions show a clear error.

---

## 12. Error Handling

- Every `async` action in a store wraps its body in `try/catch`.
- On catch: set `error: string` in the store AND log with `console.error`.
- UI components display errors via a shared `<ErrorBanner>` reading from the store.
- Unrecoverable errors (corrupt DB, quota exceeded) show a full-screen error with a "Reset app" button that clears IndexedDB.

---

## 13. Testing Strategy (Phase 1)

Phase 1 is personal use. Testing is **lightweight**:

- ✅ `npm run typecheck` passes (strong type safety is our main defense)
- ✅ `npm run lint` passes with zero warnings
- ✅ Manual smoke test on real device after each feature
- ✅ Lighthouse PWA audit before final deploy

Unit tests are **not required** for Phase 1 MVP. Phase 2 adds Vitest for store logic.

---

## 14. Deployment

- **Hosting:** Vercel (free tier)
- **Trigger:** Push to `main` branch → auto-deploy
- **Preview deployments:** Every PR
- **Custom domain:** Optional (Phase 3)
- **Environment variables:** None needed in Phase 1

```bash
# First-time setup
npm i -g vercel
vercel link
vercel --prod
```

---

## 15. Phase 2 & 3 Forward Compatibility

Decisions made now to avoid rework later:

- **i18n-ready structure:** All UI strings go through a `t()` helper (initial implementation is a no-op identity function, but the abstraction exists).
- **Training feature scaffolded:** The `features/training/` folder and types exist but are empty. SPECS.md lists training as out-of-scope for Phase 1.
- **User ID placeholder:** All Dexie records carry an optional `userId?: string` field. In Phase 1 it's undefined. In Phase 3 it becomes the Supabase user ID.
- **Export schema versioning:** `BackupFile.version = 1`. Future formats bump this and include migration.

---

## 16. Open Architectural Questions

To be resolved before coding starts:

- [ ] Icon set confirmation: lucide-react or custom SVGs?
- [ ] Font choice: Inter (Google Fonts) or system-ui only? (Google Fonts adds a network request)
- [ ] Notification timing: service worker `showNotification` or legacy `new Notification()`?
- [ ] Should `defaultMenu.ts` be editable by the user, or truly static read-only data?

Pending resolution: the owner (Daniel) decides.
