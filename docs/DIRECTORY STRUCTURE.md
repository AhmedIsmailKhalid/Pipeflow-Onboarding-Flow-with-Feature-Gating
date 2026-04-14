# DIRECTORY STRUCTURE — Pipeflow: Onboarding Flow with Feature Gating

## Root Structure

```
pipeflow/
├── .env                              # Backend environment variables (never committed)
├── .env.example                      # Template for environment variables
├── .gitignore
├── package.json                      # Root package.json (monorepo scripts)
├── README.md
│
├── frontend/                         # Vite React application
└── backend/                          # Node.js + Express API
```

---

## Frontend Structure

```
frontend/
├── .env                              # VITE_API_URL, VITE_APP_ENV
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
│
├── public/
│   ├── favicon.ico
│   └── images/
│       └── integrations/             # Slack, GitHub, Jira, Notion logos (SVGs)
│
└── src/
    │
    ├── main.tsx                      # App entry point
    ├── App.tsx                       # Root component — router, providers
    │
    ├── machines/                     # XState state machines (core of this project)
    │   ├── onboarding.machine.ts     # Main onboarding flow state machine
    │   ├── onboarding.types.ts       # Machine context, events, state types
    │   └── onboarding.guards.ts      # Guard conditions (canSkipStep, isTeamPlan, etc.)
    │
    ├── stores/                       # Zustand global state
    │   ├── auth.store.ts             # User, plan tier, JWT token
    │   ├── onboarding.store.ts       # Persisted onboarding progress
    │   └── feature.store.ts          # Feature flag / gate state derived from plan + progress
    │
    ├── hooks/                        # Custom React hooks
    │   ├── useFeatureGate.ts         # Returns { enabled, reason, upgradePrompt } for a feature
    │   ├── useOnboardingMachine.ts   # XState actor hook — exposes state, send, matches
    │   ├── useAuth.ts                # Auth store selector + token refresh logic
    │   └── usePersistProgress.ts     # Syncs onboarding progress to backend on step completion
    │
    ├── pages/                        # Route-level page components
    │   ├── LandingPage.tsx           # Public landing — hero, features, pricing
    │   ├── AuthPage.tsx              # Sign up / login (tabbed)
    │   ├── OnboardingPage.tsx        # Onboarding shell — renders current step
    │   └── DashboardPage.tsx         # Main app dashboard post-onboarding
    │
    ├── components/
    │   │
    │   ├── onboarding/               # All onboarding step components
    │   │   ├── OnboardingShell.tsx   # Progress bar, step indicator, step renderer
    │   │   ├── StepIndicator.tsx     # Visual breadcrumb of steps (1–5) with state
    │   │   ├── ProgressBar.tsx       # Animated completion % bar
    │   │   ├── Resumebanner.tsx      # "Resume where you left off" sticky banner
    │   │   │
    │   │   └── steps/
    │   │       ├── Step1Profile.tsx       # Role, team size, use case
    │   │       ├── Step2Workspace.tsx     # Workspace name, invite teammates
    │   │       ├── Step3Integrations.tsx  # Simulated integration connect (Slack, GitHub, etc.)
    │   │       ├── Step4Tour.tsx          # Interactive feature highlights / tooltips
    │   │       └── Step5Complete.tsx      # Completion screen → redirect to dashboard
    │   │
    │   ├── dashboard/                # Dashboard UI components
    │   │   ├── Sidebar.tsx           # Nav with feature-gated items
    │   │   ├── TopNav.tsx            # User menu, plan badge, notifications bell
    │   │   ├── DashboardHome.tsx     # Overview widgets
    │   │   ├── ProjectsView.tsx      # Project list (available on all plans)
    │   │   ├── AnalyticsView.tsx     # Analytics tab (locked until Step 3 complete)
    │   │   ├── IntegrationsView.tsx  # Integrations tab (locked on Starter plan)
    │   │   ├── TeamView.tsx          # Team management (locked on Starter plan)
    │   │   └── ReportsView.tsx       # Reports (Growth+ only)
    │   │
    │   ├── feature-gate/             # Feature gating UI components
    │   │   ├── GatedFeature.tsx      # Wrapper — renders children or gate overlay
    │   │   ├── UpgradePrompt.tsx     # Modal/overlay shown on locked feature click
    │   │   ├── PlanBadge.tsx         # "Starter / Growth / Scale" badge in UI
    │   │   └── LockedOverlay.tsx     # Blur + lock icon overlay for locked sections
    │   │
    │   ├── pricing/                  # Pricing page components
    │   │   ├── PricingPage.tsx       # Full pricing page with plan comparison
    │   │   ├── PricingCard.tsx       # Individual plan card
    │   │   └── FeatureComparisonTable.tsx  # Detailed feature matrix
    │   │
    │   ├── auth/
    │   │   ├── SignUpForm.tsx
    │   │   ├── LoginForm.tsx
    │   │   └── AuthGuard.tsx         # Route protection wrapper
    │   │
    │   └── ui/                       # Generic reusable primitives
    │       ├── Button.tsx
    │       ├── Input.tsx
    │       ├── Modal.tsx
    │       ├── Tooltip.tsx
    │       ├── Badge.tsx
    │       ├── Spinner.tsx
    │       └── Toast.tsx
    │
    ├── lib/
    │   ├── api.ts                    # Axios instance with JWT interceptors
    │   ├── constants.ts              # Plan feature maps, step definitions
    │   ├── featureFlags.ts           # Feature gate logic — checks plan + onboarding state
    │   └── utils.ts                  # General utility functions
    │
    ├── router/
    │   ├── index.tsx                 # React Router setup
    │   └── ProtectedRoute.tsx        # Auth + onboarding completion guard
    │
    └── types/
        ├── auth.types.ts             # User, session, JWT payload
        ├── onboarding.types.ts       # Step data, progress, answers
        ├── plan.types.ts             # Plan tiers, feature keys
        └── index.ts                  # Barrel export
```

---

## Backend Structure

```
backend/
├── package.json
├── tsconfig.json
├── Dockerfile                        # For Google Cloud Run deployment
├── .env
├── .env.example
│
├── prisma/
│   ├── schema.prisma                 # User, OnboardingProgress, Plan models
│   ├── seed.ts                       # Dev seed — creates demo users per plan tier
│   └── migrations/
│
└── src/
    ├── server.ts                     # Express app entry point
    ├── app.ts                        # App setup — middleware, routes, error handler
    │
    ├── routes/
    │   ├── auth.routes.ts            # POST /auth/signup, /auth/login, /auth/refresh
    │   ├── onboarding.routes.ts      # GET/PUT /onboarding/progress
    │   ├── plan.routes.ts            # GET /plan, POST /plan/upgrade (simulated)
    │   └── user.routes.ts            # GET /user/me
    │
    ├── controllers/
    │   ├── auth.controller.ts
    │   ├── onboarding.controller.ts
    │   ├── plan.controller.ts
    │   └── user.controller.ts
    │
    ├── middleware/
    │   ├── auth.middleware.ts        # JWT verification
    │   ├── error.middleware.ts       # Global error handler
    │   └── validate.middleware.ts    # Zod request validation
    │
    ├── services/
    │   ├── auth.service.ts           # bcrypt, JWT sign/verify, refresh tokens
    │   ├── onboarding.service.ts     # Progress CRUD, completion logic
    │   └── plan.service.ts           # Plan lookup, simulated upgrade
    │
    ├── lib/
    │   ├── prisma.ts                 # Prisma client singleton
    │   ├── jwt.ts                    # Token utilities
    │   └── logger.ts                 # Winston logger
    │
    └── types/
        ├── express.d.ts              # Augmented Express Request (req.user)
        └── index.ts
```

---

## GitHub Actions (CI/CD)

```
.github/
└── workflows/
    ├── frontend.yml                  # Build + deploy frontend to Vercel
    └── backend.yml                   # Build Docker image + deploy to GCP Cloud Run
```

---

## Key Architectural Notes

- `machines/` is the centrepiece of this project — the XState onboarding machine owns all step transitions, guards, and side effects
- `hooks/useFeatureGate.ts` is the single access point for all feature gating decisions — components never check plan tier directly
- `stores/feature.store.ts` derives gate state from both plan tier AND onboarding completion — both conditions are checked
- `components/feature-gate/GatedFeature.tsx` is a wrapper component — any feature can be gated by wrapping it, keeping gate logic out of feature components themselves
- Backend is intentionally lean — its job is auth, progress persistence, and plan lookup only. All gating logic lives client-side
