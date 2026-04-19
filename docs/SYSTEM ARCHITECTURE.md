# SYSTEM ARCHITECTURE — Pipeflow: Onboarding Flow with Feature Gating

## Architecture Overview

Pipeflow is a **single-page application** with a lean REST API backend. The architectural complexity lives entirely on the frontend — specifically in the XState onboarding machine and the feature gate system. The backend is a thin persistence and auth layer.

![Architecture Overview](/assets/Architecture-Overview.png)

---

## Core System 1: XState Onboarding Machine

The onboarding flow is modelled as a **finite state machine**. This is the engineering centrepiece of the project.

![XState Onboarding Machine](/assets/XState-Onboarding.drawio.png)


**Machine Context (carried through all states):**
```typescript
interface OnboardingContext {
  userId: string
  currentStep: 1 | 2 | 3 | 4 | 5
  completedSteps: number[]
  stepAnswers: {
    step1?: { role: string; teamSize: string; useCase: string }
    step2?: { workspaceName: string; inviteEmails: string[] }
    step3?: { connectedIntegrations: string[] }
    step4?: { tourComplete: boolean }
  }
  lastSyncedAt: string | null
  error: string | null
}
```

**Why XState over useState/useReducer:**
- Impossible states are impossible — you cannot be on step3 without having completed step1 and step2
- Guards enforce business rules declaratively, not buried in component logic
- The machine is serialisable — context can be persisted to backend and restored exactly
- The machine is testable without mounting any React component

---

## Core System 2: Feature Gate Architecture

Feature gating checks two independent conditions:

![Feature Gate Decision Tree](/assets/Feature-Gate-Architecture.png)


**Feature Key → Gate Rule Map (defined in `lib/constants.ts`):**

| Feature Key | Plan Required | Step Required |
|---|---|---|
| `projects` | any | step1 |
| `analytics` | any | step3 |
| `integrations` | GROWTH+ | step3 |
| `team_management` | GROWTH+ | step2 |
| `reports` | SCALE | — |
| `api_access` | SCALE | — |
| `custom_branding` | GROWTH+ | — |

**`GatedFeature` Component Pattern:**
```tsx
// Any feature is gated by wrapping it — no gate logic inside feature components
<GatedFeature featureKey="analytics">
  <AnalyticsView />
</GatedFeature>

// GatedFeature internally calls useFeatureGate("analytics")
// If gated: renders <LockedOverlay> + opens <UpgradePrompt> on click
// If enabled: renders children directly
```

---

## Core System 3: Progress Persistence

Onboarding state is persisted so users can leave and resume:

![Progress Persistence](/assets/Progress-Persistence.png)

---

## Data Models

```
User
├── id            UUID PK
├── email         String (unique)
├── passwordHash  String
├── name          String
├── plan          Enum: STARTER | GROWTH | SCALE
├── onboardingComplete Boolean (default: false)
└── createdAt     DateTime

OnboardingProgress
├── id            UUID PK
├── userId        UUID FK → User (1:1)
├── completedSteps Int[]
├── stepAnswers   Json
├── lastActiveStep Int
└── updatedAt     DateTime

PlanUpgrade (audit log)
├── id            UUID PK
├── userId        UUID FK → User
├── fromPlan      Enum
├── toPlan        Enum
└── createdAt     DateTime
```

---

## Auth Flow

```
Sign Up
  POST /auth/signup { email, password, name, plan }
  → bcrypt hash password
  → create User row
  → create empty OnboardingProgress row
  → return { accessToken } + set refreshToken httpOnly cookie

Login
  POST /auth/login { email, password }
  → bcrypt compare
  → return { accessToken, user } + set refreshToken httpOnly cookie

Authenticated Request
  Axios interceptor attaches Authorization: Bearer <accessToken>
  Express auth middleware verifies JWT, attaches req.user
  On 401: interceptor calls POST /auth/refresh automatically

Refresh
  POST /auth/refresh (sends httpOnly cookie automatically)
  → verify refresh token
  → return new { accessToken }
```

---

## Deployment Architecture

![Deployment Architecture](/assets/Deployment-Architecture.png)

- **Frontend**: Vercel auto-deploys on push to `main` — zero config for Vite SPAs
- **Backend**: GitHub Actions builds Docker image → pushes to GCP Artifact Registry → deploys to Cloud Run service `pipeflow-api` under GCP project
- **Database**: Neon free tier

---

## Request Flow: Onboarding Step Completion

```
1. User fills Step 2 form (workspace name + invite emails)
2. "Continue" button clicked
3. React Hook Form validates against Zod schema
4. If valid: XState machine receives NEXT event
5. Guard evaluates: step2Valid(context) → true
6. Machine transitions: step2 → step3
7. usePersistProgress detects state change
8. Fires POST /onboarding/progress with updated context
9. Backend upserts OnboardingProgress row
10. feature.store recomputes derived gate state
    → team_management now requires GROWTH plan check only
       (step2 complete gate is now cleared)
11. Component re-renders: Step 3 UI slides in (Framer Motion)
```
