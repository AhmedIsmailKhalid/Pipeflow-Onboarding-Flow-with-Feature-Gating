# TECHNOLOGY STACK — Pipeflow: Onboarding Flow with Feature Gating

## Stack at a Glance

| Layer | Technology | Version | Rationale |
|---|---|---|---|
| Frontend Framework | Vite + React | React 18, Vite 5 | Fast dev server, optimal for SPA — no SSR needed here |
| Language | TypeScript | 5.x | End-to-end type safety across frontend and backend |
| State Machine | XState | v5 | Onboarding flow modelled as a formal state machine |
| Global State | Zustand | 4.x | Lightweight store for auth, plan tier, feature gate state |
| Styling | Tailwind CSS | 3.x | Utility-first, consistent design system |
| Animations | Framer Motion | 11.x | Step transitions, progress bar, gate overlay animations |
| Routing | React Router | 6.x | Client-side routing with protected route guards |
| Forms | React Hook Form + Zod | latest | Performant forms with runtime schema validation |
| HTTP Client | Axios | 1.x | API calls with JWT interceptor, typed responses |
| Backend Framework | Node.js + Express | Express 4.x | Familiar stack, lean API surface |
| ORM | Prisma | 5.x | Type-safe DB queries, migrations, seed script |
| Database | PostgreSQL (Neon) | — | Serverless Postgres, free tier, same setup as Stackly |
| Auth | JWT + bcrypt | — | Access + refresh token pattern, password hashing |
| Validation | Zod | 3.x | Shared schemas between frontend and backend |
| Logging | Winston | 3.x | Structured logging for backend, consistent with Stackly |
| Containerisation | Docker | — | GCP Cloud Run deployment |
| Frontend Deploy | Vercel | — | Static SPA deployment, preview URLs per branch |
| Backend Deploy | Google Cloud Run | — | Consistent with existing portfolio GCP project |

---

## Frontend Deep Dive

### Vite + React 18
- SPA architecture is the correct choice here — this project is a logged-in product experience, not a public marketing site, so SSR/SEO (Next.js) adds no value
- Vite gives significantly faster HMR and build times than CRA
- React 18 concurrent features — `useTransition` used for step transitions to avoid blocking the UI

### XState v5
The centrepiece of this project's portfolio signal. XState models the onboarding as a **formal finite state machine**:
- States: `idle → step1 → step2 → step3 → step4 → step5 → complete`
- Guards: prevent advancing if required fields are empty; allow skipping optional steps based on context
- Context: carries all step answers (role, team size, integrations selected, etc.) through the flow
- Persistence: machine context is serialised and synced to backend on each step completion, enabling "resume where you left off"
- Why XState over useState/useReducer: explicit states make impossible states impossible; the machine is testable in isolation without rendering any UI

### Zustand
Three stores, each with a clear single responsibility:
- `auth.store` — current user, JWT access token, plan tier
- `onboarding.store` — persisted progress (completed steps, step answers, last active step)
- `feature.store` — derived read-only store: computes which features are gated based on current plan + onboarding progress

### Framer Motion
- Step transitions: slide-in/out animations between onboarding steps
- Progress bar: spring-animated width changes on step advance
- Gate overlay: fade-in blur + lock icon when a locked feature is clicked
- Tour tooltips: animated appearance/dismissal in Step 4

### React Hook Form + Zod
- Each onboarding step form is registered with RHF for zero re-renders on input change
- Zod schemas validate step data before the XState machine advances to the next state
- Shared Zod schemas between frontend validation and backend request validation

---

## Backend Deep Dive

### Node.js + Express
- Intentionally lean — 4 route groups, each with a controller and service layer
- The backend's only jobs: auth (signup/login/refresh), persist onboarding progress, serve plan info
- All feature gate logic lives client-side — the backend never enforces gates, it only stores state

### Prisma + PostgreSQL (Neon)
Three core models:
- `User` — id, email, passwordHash, plan (STARTER | GROWTH | SCALE), onboardingComplete, createdAt
- `OnboardingProgress` — userId (1:1), completedSteps (array), stepAnswers (JSON), lastActiveStep, updatedAt
- `PlanUpgrade` — userId, fromPlan, toPlan, createdAt (audit log for simulated upgrades)

### JWT Auth Pattern
- Short-lived access token (15 min) + long-lived refresh token (7 days)
- Refresh token stored in httpOnly cookie — not accessible to JS
- Access token in memory (Zustand store) — never in localStorage
- Axios interceptor automatically refreshes access token on 401 response

---

## Why This Stack vs Alternatives

| Decision | Chosen | Alternative Considered | Reason |
|---|---|---|---|
| State machine | XState v5 | useState + useReducer | XState makes the machine testable, visualisable, and portfolio-differentiating |
| Framework | Vite React | Next.js | Next.js already used in Knotly; no new signal. This project's value is client-side architecture |
| Backend | Express | Next.js API routes | Keeps frontend and backend concerns cleanly separated; Cloud Run deployment is simpler with standalone Express |
| Database | Neon PostgreSQL | Supabase | Supabase used in Luxe; Neon gives raw Postgres with Prisma, same as Stackly — no new dependency |
| Animation | Framer Motion | CSS transitions | Framer Motion's spring physics and layout animations are significantly more polished for a multi-step flow |

---

## Portfolio Signal This Stack Delivers

| Signal | Technology | What It Proves |
|---|---|---|
| Senior frontend architecture | XState v5 | You model complex UI flows correctly, not with ad-hoc state |
| State management maturity | Zustand (3 purposeful stores) | You know when to use global state and when not to |
| Type safety discipline | TypeScript + Zod (shared schemas) | End-to-end type safety mindset |
| Production auth patterns | JWT + httpOnly refresh cookie | You understand security tradeoffs, not just "localStorage is fine" |
| Animation quality | Framer Motion | Polish and UX attention that separates senior from mid-level |
| Deployment maturity | Vercel + GCP Cloud Run | Real production deployment, not just localhost screenshots |
