# A.R.M. Protocol PWA

> Progressive Web App para seguir el protocolo de nutrición A.R.M. (Availability, Recovery, Metabolic Stability).
> Timer de ayuno, menú semanal, lista de la compra auto-generada y tracking de suplementos — todo offline, sin cuenta, desde el móvil.

---

## 🎯 ¿Qué es esto?

Una PWA personal para centralizar el día a día del protocolo A.R.M. La idea: dejar de saltar entre Skool, PDFs y vídeos de Zoom, y tener un único sitio con lo operativo.

**Fase 1 (MVP):** Uso personal, 100% local, sin backend, sin login.
**Fase 2:** Módulo de entrenamiento + estadísticas avanzadas.
**Fase 3:** Backend con Supabase, auth, sincronización entre dispositivos, posible release público.

---

## 📂 Contenido de este repositorio

Este repo contiene **documentación** lista para que Claude Code (con agentes) construya el proyecto. El código fuente se genera ejecutando las tareas del task breakdown.

```
arm-protocol/
├── README.md                  ← Este archivo (instrucciones para Daniel)
├── CLAUDE.md                  ← Constitución del proyecto (leída por Claude Code)
├── SPECS.md                   ← Requisitos de producto + dominio A.R.M.
├── ARCHITECTURE.md            ← Decisiones técnicas
└── docs/
    ├── task-breakdown.md      ← 20+ tareas atómicas ordenadas
    ├── progress.md            ← Memoria persistente entre sesiones
    └── templates/
        ├── store-template.ts
        ├── component-template.tsx
        ├── page-template.tsx
        └── hook-template.ts
```

---

## 🛠 Stack Técnico

| Capa | Tecnología |
|------|------------|
| Framework | React 18.3.1 + TypeScript 5.5 |
| Build | Vite 5.4 + vite-plugin-pwa |
| Estilos | Tailwind CSS 3.4 (dark mode) |
| Estado | Zustand 4.5 |
| Persistencia | Dexie.js 4.0 (IndexedDB) |
| Animaciones | Framer Motion 11 |
| Iconos | lucide-react |
| Router | react-router-dom 6.23 |
| Deploy | Vercel |

**Sin backend en Fase 1.** Todo local en el dispositivo del usuario.

---

## ✅ Antes de empezar — Prerrequisitos

En tu máquina local o VPS de Hetzner:

```bash
node -v      # >= 20.0.0
npm -v       # >= 10.0.0
git --version
```

Si usas tu Hetzner VPS con tmux + Mosh como habitualmente, abre una sesión dedicada:

```bash
tmux new -s arm-protocol
```

---

## 🚦 Checklist previo (OBLIGATORIO antes de codear)

Resuelve estas 4 preguntas abiertas en `docs/progress.md` antes de que los agentes empiecen:

1. **Icon set:** ¿Solo lucide-react, o añadimos SVGs custom para branding?
2. **Fuente:** ¿Inter desde Google Fonts (network request) o solo system-ui?
3. **Notificaciones:** ¿Service worker `showNotification` o legacy `new Notification()`?
4. **Menú por defecto:** ¿El usuario podrá editarlo, o es estático read-only?

Mi recomendación por defecto (si quieres ir rápido):

1. Solo lucide-react
2. system-ui (evitas el round-trip a Google Fonts y mejora el Lighthouse)
3. Service worker showNotification (más moderno, funciona en iOS 16.4+ PWA)
4. Estático en Fase 1, editable en Fase 2

Actualiza `docs/progress.md` Session 0 marcando las decisiones tomadas.

---

## 🤖 Workflow con Claude Code + Agentes

### Paso 1 — Sube este repo a GitHub

```bash
cd arm-protocol
git init
git add .
git commit -m "docs: project constitution and task breakdown"
gh repo create arm-protocol --private --source=. --push
```

### Paso 2 — Clona en tu entorno de trabajo (VPS Hetzner)

```bash
ssh tu-vps-hetzner
tmux new -s arm-protocol
git clone https://github.com/tu-user/arm-protocol.git
cd arm-protocol
```

### Paso 3 — Abre Claude Code

```bash
claude
```

### Paso 4 — Primer prompt (CRÍTICO)

**No le digas "construye la app".** Usa este patrón de `read first, confirm, then code`:

```
Proyecto: A.R.M. Protocol PWA

Antes de hacer nada:
1. Lee CLAUDE.md completo
2. Lee SPECS.md
3. Lee ARCHITECTURE.md
4. Lee docs/task-breakdown.md
5. Lee docs/progress.md

Después, NO empieces a codificar. Responde con:
- Resumen del stack en 3 frases
- Primera task que vas a ejecutar (con su ID exacto)
- Cualquier pregunta de clarificación

Solo cuando yo confirme, arrancamos con Task 1.1.
```

### Paso 5 — Ejecuta tareas una a una

Para cada task del breakdown:

```
Ejecuta Task X.Y del task-breakdown.md

Reglas:
- Solo modifica los archivos listados en "Files to create" o "Files to modify"
- Al terminar, ejecuta `npm run validate`
- Si validate falla, corrige antes de marcar como completa
- No avances a la siguiente task sin mi aprobación
```

### Paso 6 — Distribuye a subagentes (opcional, si tienes orquestador)

Según la asignación sugerida:

| Subagente | Responsabilidad |
|-----------|----------------|
| Backend agent | `src/db/`, `src/features/*/store/`, tipos |
| Frontend agent | `src/features/*/components/`, `src/shared/components/` |
| PWA agent | `vite.config.ts`, service worker, manifest, deploy |
| Review agent | Al final de cada milestone, revisa el código generado |

### Paso 7 — Al final de cada sesión

```
Actualiza docs/progress.md con:
- Tasks completadas
- Decisiones tomadas (con razón)
- Preguntas abiertas
- Siguiente task recomendada
```

---

## 🗺 Roadmap de Milestones

| Milestone | Tareas | Entregable |
|-----------|--------|------------|
| **M1 — Foundation** | 1.1 → 1.7 | Proyecto navegable con shell + 5 páginas placeholder desplegado en Vercel |
| **M2 — Fasting Timer** | 2.1 → 2.6 | Timer completo con persistencia, racha, historial y notificaciones |
| **M3 — Weekly Menu** | 3.1 → 3.4 | Menú semanal con 7 días precargados, vista día/semana |
| **M4 — Shopping List** | 4.1 → 4.3 | Lista de compra auto-generada, compartir, checkboxes |
| **M5 — Supplements** | 5.1 → 5.2 | Tracking diario con adherencia semanal |
| **M6 — Dashboard + Deploy** | 6.1 → 6.4 | HomePage con resumen del día, export/import, instalación PWA y deploy |

**Estimación:** 2-3 semanas con dedicación parcial. M1 en 1-2 días de trabajo (base navegable rápida = feedback loop temprano).

---

## 📏 Reglas clave (extracto de CLAUDE.md)

**Tamaños máximos:**
- Componente: 150 líneas (si más → dividir)
- Función: 30 líneas (si más → refactorizar)

**Prohibido:**
- `any` en TypeScript
- `localStorage` (salvo preferencias UI <1KB)
- CSS-in-JS (solo Tailwind)
- Redux, MobX, Context para estado (solo Zustand)
- React.FC
- Comentarios explicando QUÉ hace el código (solo POR QUÉ)
- `console.log` en código commiteado

**Obligatorio:**
- `npm run validate` antes de cerrar cualquier task
- `import type` para importar tipos
- Alias `@/` para imports absolutos
- Actualizar `docs/progress.md` al final de cada sesión

Lee `CLAUDE.md` para la lista completa.

---

## 🧪 Scripts disponibles (una vez generado el proyecto)

```bash
npm run dev         # Servidor desarrollo en localhost:5173
npm run build       # Build producción
npm run preview     # Preview del build
npm run typecheck   # tsc --noEmit
npm run lint        # ESLint con --max-warnings 0
npm run validate    # typecheck + lint + build (antes de cada commit)
```

---

## 🚀 Deploy en Vercel

Cuando el MVP esté listo (Task 6.4):

```bash
npm install -g vercel
cd arm-protocol
vercel link
vercel --prod
```

O conecta el repo de GitHub a Vercel y haz auto-deploy en cada push a `main`.

---

## 🐛 Troubleshooting común

**"El agente instaló la última versión de algo y rompió el build"**
→ Revisa `package.json`, asegúrate que las versiones están pineadas sin `^` ni `~`. Vuelve a commitear con las versiones exactas del CLAUDE.md.

**"Cada sesión de Claude Code empieza de cero"**
→ Es normal. Por eso existe `docs/progress.md`. Al empezar una sesión nueva, carga ese archivo primero en el contexto.

**"Los agentes generan código inconsistente entre features"**
→ Refuerza el uso de `docs/templates/`. En el prompt inicial: "Todos los stores deben seguir `docs/templates/store-template.ts` al pie de la letra".

**"npm run validate falla después de una task"**
→ No avances a la siguiente task. Pide al agente: "Corrige los errores de validate antes de continuar. Si fallas 2 veces, para y pregúntame".

**"El timer no funciona cuando cierro la app"**
→ Verifica que usas timestamps absolutos (`Date.now()`), no contadores con `setInterval`. Ver ARCHITECTURE.md §6.

**"iOS no muestra notificaciones"**
→ Web Push solo funciona en iOS 16.4+ en PWAs instaladas desde Safari. Para iOS antiguos hay que usar recordatorios in-app como fallback.

---

## 📚 Recursos

- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Dexie.js](https://dexie.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Claude Code docs](https://docs.claude.com/en/docs/claude-code)

---

## 🧭 Filosofía del proyecto

1. **Offline-first.** Si no funciona sin internet, está mal hecho.
2. **Local-first data.** Los datos son del usuario, no del servidor.
3. **Minimal surface area.** Menos dependencias, menos abstracciones, menos código.
4. **Feature-based.** Organización por dominio, no por tipo de archivo.
5. **Ship simple.** El MVP funciona con lo mínimo. Todo lo demás es scope creep.

---

## 📝 Licencia

Proyecto personal. No distribuir sin permiso.
