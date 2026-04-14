# IMPLEMENTATION ROADMAP — Pipeflow: Onboarding Flow with Feature Gating

## Overview

| Phase | Focus | Deliverable |
|---|---|---|
| Phase 1 | Project Setup + Backend Foundation | Monorepo, Express API, Prisma schema, auth endpoints |
| Phase 2 | XState Onboarding Machine | Core state machine, types, guards, persistence hook |
| Phase 3 | Onboarding UI — Steps 1–5 | All step components, shell, progress bar, step indicator |
| Phase 4 | Feature Gate System | Gate hook, GatedFeature wrapper, UpgradePrompt, plan store |
| Phase 5 | Dashboard with Gated Features | Sidebar, all dashboard views, locked overlays |
| Phase 6 | Landing Page + Auth + Pricing | Public pages, sign up / login forms, pricing comparison |
| Phase 7 | Polish + Deployment | Animations, ResumeBanner, empty states, Vercel + Cloud Run |

---

## Phase 1 — Project Setup + Backend Foundation

**Goal:** Working monorepo, Express server, Prisma connected to Neon, all auth endpoints functional.

### 1.1 Monorepo Setup
- Initialise root `package.json` with workspace scripts
- Create `frontend/` and `backend/` directories
- Configure root `.gitignore`, `.env.example`

### 1.2 Backend Init
- Express + TypeScript setup
- Winston logger
- Global error middleware
- CORS configured for frontend origin
- Health check endpoint `GET /health`

### 1.3 Prisma + Database
- Connect to Neon PostgreSQL
- Define schema: `User`, `OnboardingProgress`, `PlanUpgrade`
- Run initial migration
- Write seed script: 3 demo users (one per plan tier) with partial onboarding progress

### 1.4 Auth Endpoints
- `POST /auth/signup` — create user, hash password, return access token + set refresh cookie
- `POST /auth/login` — verify credentials, return tokens
- `POST /auth/refresh` — refresh access token from httpOnly cookie
- `POST /auth/logout` — clear refresh cookie
- `GET /user/me` — return current user (auth required)

### 1.5 Onboarding Progress Endpoints
- `GET /onboarding/progress` — return current user's progress
- `PUT /onboarding/progress` — upsert completed steps + step answers

### 1.6 Plan Endpoint
- `GET /plan` — return current user's plan + feature entitlements
- `POST /plan/upgrade` — simulate plan upgrade (update plan field, create PlanUpgrade audit row)

**Phase 1 Complete When:** `npm run dev` starts backend, seed runs cleanly, all endpoints return correct responses via Postman/curl.

---

## Phase 2 — XState Onboarding Machine

**Goal:** Core state machine fully defined and working — independently of any UI.

### 2.1 Machine Definition (`machines/onboarding.machine.ts`)
- Define all states: `idle`, `step1` through `step5`, `complete`
- Define context shape with TypeScript types
- Define all events: `START`, `NEXT`, `BACK`, `SKIP`, `ABANDON`, `RESTORE`, `GO_TO_DASHBOARD`
- Define guards: `step1Valid`, `step2Valid`, `canSkipStep3`
- Define entry actions: `syncProgress` (fires on each step entry)

### 2.2 Machine Guards (`machines/onboarding.guards.ts`)
- `step1Valid`: role, teamSize, useCase all non-empty in context
- `step2Valid`: workspaceName non-empty in context
- `canSkipStep3`: always true (integrations are optional)

### 2.3 Zustand Stores
- `auth.store.ts`: user, accessToken, plan, setUser, setToken, logout
- `onboarding.store.ts`: progress, stepAnswers, setProgress, restoreFromBackend
- `feature.store.ts`: derived — computes enabled/disabled per feature key based on plan + completedSteps

### 2.4 `useOnboardingMachine` Hook
- Creates XState actor from machine
- Exposes: `state`, `send`, `matches`, `context`
- On mount: fetches persisted progress from backend, fires RESTORE event to rehydrate machine

### 2.5 `usePersistProgress` Hook
- Subscribes to machine state changes
- On each step completion (state transition to next step): fires PUT /onboarding/progress
- Debounced to avoid hammering API

**Phase 2 Complete When:** Machine can be stepped through in a test (no UI), guards work, persistence hook calls backend correctly.

---

## Phase 3 — Onboarding UI (Steps 1–5)

**Goal:** Full onboarding flow is navigable in the browser with all step forms working.

### 3.1 Onboarding Shell (`components/onboarding/OnboardingShell.tsx`)
- Renders current step component based on machine state
- Contains `ProgressBar` and `StepIndicator`
- Handles Back button (fires BACK event to machine)
- Handles Skip button on step 3 (fires SKIP event)

### 3.2 `ProgressBar.tsx`
- Animated width: `(currentStep / 5) * 100%`
- Framer Motion spring animation on width change

### 3.3 `StepIndicator.tsx`
- 5 circles — completed (filled + checkmark), current (highlighted), upcoming (empty)
- Framer Motion animate between states

### 3.4 Step Components
Each step:
- Has its own React Hook Form instance with Zod schema
- On valid submit: updates XState context via NEXT event
- Shows validation errors inline

**Step 1 — Profile:**
- Role select: Solo Founder / Engineering Manager / Product Manager / Other
- Team size select: Just me / 2–10 / 11–50 / 50+
- Use case select: Engineering / Design / Marketing / Operations

**Step 2 — Workspace:**
- Workspace name text input
- Invite teammates: add email inputs (up to 5, add more button)

**Step 3 — Integrations:**
- Grid of integration cards: Slack, GitHub, Jira, Notion, Figma, Linear
- Each card: logo + name + "Connect" button
- On click: 1.5s simulated loading → "Connected" success state with checkmark
- Skip button available throughout

**Step 4 — Feature Tour:**
- 4 highlight cards, each describing a core feature
- "Next" cycles through them, final one unlocks "Finish Tour" button
- Animated card transitions

**Step 5 — Complete:**
- Celebration animation (Framer Motion)
- Summary: workspace name, connected integrations count, teammate invites sent
- "Go to Dashboard" button → fires GO_TO_DASHBOARD → React Router navigates to `/dashboard`

### 3.5 `ResumeBanner.tsx`
- Shown on dashboard/login if `onboardingComplete === false` and `completedSteps.length > 0`
- Displays: "You're X% through setup — pick up where you left off"
- CTA button navigates back to `/onboarding` — machine restores to last active step

**Phase 3 Complete When:** User can complete all 5 steps, skip step 3, go back between steps, and land on the dashboard. Refreshing mid-flow restores progress.

---

## Phase 4 — Feature Gate System

**Goal:** `useFeatureGate` hook working, `GatedFeature` wrapper working, gate state derived from plan + onboarding.

### 4.1 `lib/featureFlags.ts`
- Define `FEATURE_GATE_MAP`: maps each feature key to `{ minPlan, requiredStep }`
- Define `PLAN_HIERARCHY`: STARTER=0, GROWTH=1, SCALE=2

### 4.2 `hooks/useFeatureGate.ts`
- Reads from `feature.store` (plan + completedSteps)
- Returns `{ enabled: boolean, reason: 'plan' | 'step' | null, requiredPlan?, requiredStep? }`

### 4.3 `feature.store.ts`
- Derived from auth.store (plan) + onboarding.store (completedSteps)
- Exposes: `isFeatureEnabled(featureKey: string): boolean`
- Recomputes automatically when either store updates

### 4.4 `GatedFeature.tsx`
- Wraps any component: `<GatedFeature featureKey="analytics"><AnalyticsView /></GatedFeature>`
- If enabled: renders children
- If gated: renders children behind `LockedOverlay`; click opens `UpgradePrompt`

### 4.5 `LockedOverlay.tsx`
- CSS blur filter over children
- Lock icon + gate reason text centred
- Framer Motion fade-in

### 4.6 `UpgradePrompt.tsx`
- Modal triggered when locked feature is clicked
- Shows: what the feature is, what plan/step unlocks it
- If plan gate: "Upgrade to Growth" CTA → fires POST /plan/upgrade (simulated) → plan updates → gate clears
- If step gate: "Complete Step X" CTA → navigates to `/onboarding`

**Phase 4 Complete When:** Clicking any locked feature shows correct gate reason. Simulated upgrade clears plan gates immediately. Step completion clears step gates.

---

## Phase 5 — Dashboard with Gated Features

**Goal:** Full dashboard with all navigation items, gated views, and working gate overlays.

### 5.1 Dashboard Layout
- `Sidebar.tsx`: navigation items, each with feature gate check — locked items show lock icon badge
- `TopNav.tsx`: user avatar, plan badge (coloured by tier), onboarding resume button if incomplete

### 5.2 Dashboard Views
- `DashboardHome.tsx`: overview widgets — active projects, team members, recent activity (always accessible)
- `ProjectsView.tsx`: project list with create button (available to all plans after step1)
- `AnalyticsView.tsx`: wrapped in `<GatedFeature featureKey="analytics">` (requires step3)
- `IntegrationsView.tsx`: wrapped in `<GatedFeature featureKey="integrations">` (GROWTH+, step3)
- `TeamView.tsx`: wrapped in `<GatedFeature featureKey="team_management">` (GROWTH+, step2)
- `ReportsView.tsx`: wrapped in `<GatedFeature featureKey="reports">` (SCALE only)

### 5.3 Plan Badge
- `PlanBadge.tsx`: coloured pill — grey (Starter), blue (Growth), purple (Scale)
- Shown in TopNav and on UpgradePrompt

**Phase 5 Complete When:** All dashboard views render; gated views show correct overlays; upgrade simulation clears plan gates and re-renders gated content.

---

## Phase 6 — Landing Page, Auth, Pricing

**Goal:** Public-facing pages completed so the project has a proper entry point for portfolio viewers.

### 6.1 Landing Page (`pages/LandingPage.tsx`)
- Hero: headline, subheadline, "Start Free" + "See Demo" CTAs
- Features section: 3 key feature highlights with icons
- Social proof: fake logo strip ("Trusted by 2,000+ teams")
- Pricing section: links to `/pricing`
- Footer

### 6.2 Auth Page (`pages/AuthPage.tsx`)
- Tabbed: Sign Up / Login
- Sign Up: name, email, password, plan selector (Starter default)
- Login: email, password
- On success: JWT stored in auth.store, redirect to `/onboarding` (new user) or `/dashboard` (returning)

### 6.3 Pricing Page (`pages/PricingPage.tsx`)
- Three plan cards: Starter (free), Growth ($29/mo), Scale ($99/mo)
- Feature comparison table: all feature keys with ✓ / — per plan
- CTA per plan → auth signup with plan pre-selected

**Phase 6 Complete When:** Full user journey works: landing → pricing → signup → onboarding → dashboard.

---

## Phase 7 — Polish + Deployment

**Goal:** Production-ready quality, deployed and live.

### 7.1 Animations + Transitions
- Framer Motion `AnimatePresence` on all step transitions (slide direction: forward/back)
- Progress bar spring animation
- UpgradePrompt modal entrance animation
- Step completion confetti/celebration on Step 5

### 7.2 Empty + Error States
- Each dashboard view: loading skeleton, empty state, error boundary
- Onboarding: network error on persist → toast warning, retry silently
- Auth: clear error messages on failed login/signup

### 7.3 Mobile Responsiveness
- Sidebar collapses to bottom nav on mobile
- Onboarding steps stack vertically on small screens
- Touch-friendly step navigation

### 7.4 Deployment
- Frontend: Vercel deployment, environment variables set via Vercel dashboard
- Backend: Dockerfile, GitHub Actions workflow → GCP Artifact Registry → Cloud Run service `pipeflow-api`
- Database: Neon production branch, connection string in Cloud Run env vars
- Run `prisma migrate deploy` in Cloud Run startup or as a pre-deploy step

### 7.5 Demo Seed + README
- Seed creates 3 demo accounts (one per plan) with various onboarding progress states
- README: architecture diagram, live URLs, demo credentials, local setup instructions
- LinkedIn project write-up with onboarding flow recording (screen capture)

**Phase 7 Complete When:** Live URLs working, demo credentials functional, mobile responsive, README complete.

---

## Build Order Summary

```
Phase 1  →  Backend foundation (Express, Prisma, auth endpoints)
Phase 2  →  XState machine (no UI — pure logic)
Phase 3  →  Onboarding UI steps 1–5
Phase 4  →  Feature gate system
Phase 5  →  Dashboard + gated views
Phase 6  →  Landing, auth, pricing pages
Phase 7  →  Polish, deploy, README
```

Total estimated build time: 3–4 weeks at a measured pace across multiple chat sessions.
