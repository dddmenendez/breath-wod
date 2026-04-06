# SPECS.md — A.R.M. Protocol PWA

> Product requirements. Read after `CLAUDE.md`.
> Describes **WHAT** to build. Technical **HOW** lives in `ARCHITECTURE.md`.

---

## 1. Product Vision

A personal Progressive Web App to follow the A.R.M. nutrition protocol end-to-end from a mobile device, offline, without accounts or servers in Phase 1.

The user (Daniel) currently juggles the protocol across a Skool community, PDFs, and Zoom replays. This app centralizes the actionable parts: fasting timer, weekly menu, auto-generated shopping list, supplement tracker, and training routine.

**Phase 1:** Personal use only. 100% local data. No auth. No backend.
**Phase 2:** Training module + advanced stats + data export/import.
**Phase 3:** Supabase backend + auth + cross-device sync + potential public release.

---

## 2. The A.R.M. Protocol (Domain Knowledge)

Agents need to understand the domain to build it correctly.

### Three Pillars

1. **A — Availability:** Adequate, nutrient-dense fuel. No calorie restriction.
2. **R — Recovery Support:** Collagen, organ meats, quality fats, bone broth.
3. **M — Metabolic Stability:** Stable energy. No sugar spikes. Whole foods.

### Daily Routine

| Time | Action |
|------|--------|
| 21:00 | Meal 2 (last meal of the day) |
| 21:00–11:00 (next day) | Fasting window (14–16h). Only water, black coffee, or unsweetened tea allowed. |
| ~11:00 | Break fast with bone broth + pinch of cayenne pepper |
| ~12:00 | Meal 1 (eggs + simple carb + healthy fat) |
| ~20:30 | Meal 2 (high-quality protein + carb + fat) |

### Monthly Protocol

One 32-hour extended fast per month for cellular autophagy.

### 7-Day Menu Rotation

| Day | Meal 1 | Meal 2 |
|-----|--------|--------|
| 1 | Eggs + rice + olive oil | 3 burgers + sweet potato + avocado |
| 2 | Eggs + potatoes + butter | Salmon + potatoes + avocado |
| 3 | Eggs + rice + olive oil | Steak + sweet potato + butter |
| 4 | Eggs + sweet potato + olive oil | Ground beef + rice + avocado |
| 5 | Eggs + potatoes + butter | Liver + potatoes + onion |
| 6 | Eggs + rice + olive oil | Steak + sweet potato + avocado |
| 7 | Eggs + sweet potato + olive oil | Salmon + potatoes + butter |

### Supplements

| Supplement | Dose | Timing |
|------------|------|--------|
| Creatine monohydrate | 5g | Pre-workout |
| Creatine monohydrate | 10g | Before sleep |
| Magnesium glycinate | 300–400mg | Before sleep |
| Sodium bicarbonate | 0.5 tsp in water | Post-workout |
| Epsom salt | Bath soak | 1–2x/week (evening) |
| Raw shilajit | Pea-sized piece | Morning |
| Bee bread | 1 tsp | Morning |

### Food Lists

**YES list:** grass-fed red meat, eggs, wild fish, liver, white rice, potatoes, sweet potatoes, avocado, olive oil, butter, raw dairy (if tolerated), fruit, honey, dates, dark chocolate (85%+), bone broth, cayenne pepper.

**NO list:** seed oils (canola, soybean, corn, sunflower), processed sugar, protein bars, ultra-processed foods.

---

## 3. User Stories

### Fasting

- **US-F1:** As a user, I want to start a fasting timer with a target duration (14/15/16h) so I can track my daily fast.
- **US-F2:** As a user, I want to see a visual circular progress ring showing elapsed time and time remaining.
- **US-F3:** As a user, I want the timer to keep working even if I close the app (based on absolute timestamps).
- **US-F4:** As a user, I want a push notification 30 minutes before reaching my target and another when I reach it.
- **US-F5:** As a user, I want to "break fast" with a button that logs the actual duration.
- **US-F6:** As a user, I want to see my streak (consecutive completed fasts) and history (last 30 days).
- **US-F7:** As a user, I want a separate mode for the monthly 32h extended fast.

### Menu

- **US-M1:** As a user, I want to see today's meals at a glance on the home screen.
- **US-M2:** As a user, I want to browse the full 7-day weekly menu.
- **US-M3:** As a user, I want to tap a meal to see its ingredients, amounts, and preparation steps.
- **US-M4:** As a user, I want to mark meals as completed (checkbox or swipe).
- **US-M5:** As a user, I want a reminder of the digestion protocol (breathe, eat calmly, no screens) before meals.

### Shopping

- **US-S1:** As a user, I want the shopping list to be auto-generated from the weekly menu.
- **US-S2:** As a user, I want ingredients grouped by category (Protein, Carbs, Fats, Veggies, Extras, Supplements).
- **US-S3:** As a user, I want repeated ingredients summed (e.g., eggs across 7 days → total count).
- **US-S4:** As a user, I want to check off items as I buy them.
- **US-S5:** As a user, I want "staple items" (salt, olive oil, cayenne, vinegar) auto-added if I haven't marked them as "in pantry".
- **US-S6:** As a user, I want to share the list via the Web Share API (WhatsApp, etc.) or copy to clipboard.
- **US-S7:** As a user, I want to add/remove items manually.

### Supplements

- **US-SU1:** As a user, I want a daily checklist of supplements grouped by timing (morning, pre-workout, night, weekly).
- **US-SU2:** As a user, I want to tap each supplement to see its purpose, dose, and notes.
- **US-SU3:** As a user, I want to see weekly adherence (% of supplements taken).
- **US-SU4:** As a user, I want to configure reminder notifications for specific supplements.
- **US-SU5:** As a user, I want to add/remove custom supplements beyond the default set.

### Home (Dashboard)

- **US-H1:** As a user, opening the app shows me the state of today: active fast, next meal, pending supplements.
- **US-H2:** As a user, I want quick-action buttons: start fast, view today's menu, log supplement.

### Data Management

- **US-D1:** As a user, I want to export all my data to a JSON file as a backup.
- **US-D2:** As a user, I want to import a JSON file to restore my data.
- **US-D3:** As a user, I want the app to work 100% offline.
- **US-D4:** As a user, I want to install the app on my phone's home screen (PWA).

---

## 4. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | First Contentful Paint < 1.5s on 4G. Lighthouse PWA score ≥ 90. |
| **Offline** | 100% functional without network. Service worker caches all assets. |
| **Installable** | Valid `manifest.json` + icons. Install prompt on first visit. |
| **Responsive** | Mobile-first (320px–768px). Desktop is a bonus. |
| **Notifications** | Web Push API with permission prompt. Graceful fallback to in-app reminders. |
| **Language** | UI in Spanish. i18n-ready structure for future English support. |
| **Accessibility** | WCAG AA contrast. Keyboard navigation. Proper ARIA labels. |
| **Data Safety** | Export/import JSON backup available from settings. |
| **No Auth (Phase 1)** | No login required. All data local to the device. |

---

## 5. Out of Scope (Phase 1)

Explicit non-goals. Do not build these in Phase 1:

- ❌ User accounts, authentication, login
- ❌ Backend API or database server
- ❌ Cross-device synchronization
- ❌ Social features (sharing progress, friends, feed)
- ❌ Training module (comes in Phase 2)
- ❌ Advanced statistics and charts beyond basic streak/adherence
- ❌ Video content embedding
- ❌ Meal customization UI (use the default menu as-is)
- ❌ Barcode scanning
- ❌ Integration with fitness trackers (Apple Health, Google Fit)
- ❌ Light mode (dark mode only)
- ❌ Multi-language UI (Spanish only; structure must be i18n-ready)

---

## 6. Success Metrics (Personal Use)

| Metric | Target |
|--------|--------|
| PWA installed on Daniel's phone | Week 3 |
| Fasting timer used daily | From Week 4 |
| Shopping list used weekly | From Week 4 |
| Supplement adherence tracked | From Week 4 |
| Data backup test (export + import) | Week 3 |
| Lighthouse PWA score | ≥ 90 |

---

## 7. Glossary

| Term | Definition |
|------|------------|
| **A.R.M.** | Availability, Recovery, Metabolic Stability — the three pillars of the protocol |
| **Meal 1** | First meal of the day (~12:00), typically eggs-based |
| **Meal 2** | Second meal of the day (~20:30), protein-heavy |
| **Fasting window** | 14–16h daily period with no caloric intake |
| **Bone broth** | Mineral-rich broth that breaks the daily fast |
| **Streak** | Consecutive days with a completed fast |
| **Adherence** | % of scheduled supplements actually taken |
| **Staple item** | Pantry basic auto-added to shopping list (salt, oil, cayenne, vinegar) |
