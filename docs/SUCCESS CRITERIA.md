# SUCCESS CRITERIA — Pipeflow: Onboarding Flow with Feature Gating

## Engineering Criteria

| Criteria | Definition of Done |
|---|---|
| State machine correctness | XState machine cannot reach an invalid state — step 3 is unreachable without steps 1 and 2 complete; `complete` state is terminal |
| Guard enforcement | Clicking "Continue" on a step with empty required fields does NOT advance the machine — form validation fires first, machine never receives NEXT event |
| Progress persistence | Completing step 2, closing the browser, and reopening restores the machine to step 3 with step 1 and 2 answers intact |
| Resume banner | A user who abandons mid-flow and logs back in sees the ResumeBanner with correct step count on the dashboard |
| Plan gate enforcement | A Starter plan user clicking the Integrations tab sees the LockedOverlay + correct upgrade prompt — they cannot access the content |
| Step gate enforcement | A user who skipped step 3 (integrations) sees the Analytics tab gated with "Complete Step 3 to unlock" — regardless of plan |
| Simulated upgrade works | Clicking "Upgrade to Growth" in UpgradePrompt fires the plan upgrade, updates the user's plan in the database, and clears plan-gated features immediately without page refresh |
| Skip step works | Step 3 can be skipped — machine advances to step 4 with `connectedIntegrations: []` in context; step 3 does NOT appear in `completedSteps` |
| Back navigation works | Pressing Back on any step returns to the previous step with previously entered answers pre-filled |
| Auth security | All backend routes except `/auth/*` and `GET /` reject requests without a valid JWT with 401 |
| Token refresh | An expired access token is automatically refreshed via the Axios interceptor — user does not see an error or get logged out |
| Type safety | Zero TypeScript errors across frontend and backend (`tsc --noEmit` passes clean) |

---

## UX Criteria

| Criteria | Definition of Done |
|---|---|
| Step transitions | Advancing forward slides content left; going back slides content right — Framer Motion, no jank |
| Progress bar | Animates smoothly to correct percentage on each step transition (20%, 40%, 60%, 80%, 100%) |
| Step indicator | Completed steps show checkmark, current step is highlighted, future steps are inactive |
| Integration connect simulation | Clicking "Connect" on an integration shows a loading spinner for ~1.5s then transitions to a "Connected" success state with checkmark |
| Step 5 completion | Celebration animation plays on reaching step 5 — does not auto-redirect, user must click "Go to Dashboard" |
| Locked feature UX | Clicking a locked sidebar item does not navigate — it opens the UpgradePrompt modal in place |
| Locked overlay | Locked dashboard content is blurred, not hidden — user can see what they're missing |
| Empty states | Every dashboard view has a meaningful empty state (not a blank page) when no data exists |
| Mobile usability | Onboarding flow and dashboard are fully usable on a 375px viewport — no horizontal scroll |
| Loading states | Every async operation (login, step save, plan upgrade) shows a loading indicator — no blank waits |

---

## Portfolio / Demo Criteria

| Criteria | Definition of Done |
|---|---|
| Demo accounts | Three pre-seeded accounts (starter@demo.com / growth@demo.com / scale@demo.com, password: `Demo1234!`) each with different plan and onboarding state so a reviewer can see all gate variations without signing up |
| Live URLs | Frontend (Vercel) and backend (Cloud Run) both have stable public URLs — no sleep/spin-down gap |
| Reviewer can self-serve | A hiring manager can visit the landing page, sign up, complete onboarding, and see feature gating in action without any instructions |
| Architecture explainability | You can describe the XState machine, the two-condition gate system, and the persistence mechanism in a 3-minute verbal walkthrough |
| README completeness | README includes: live URL, demo credentials, local setup steps, architecture diagram, tech stack summary |
| No console errors | Browser console is clean in production build — no unhandled errors, no prop-type warnings |

---

## What This Project Proves to a Hiring Manager

| Signal | Evidence |
|---|---|
| Senior frontend architecture | XState state machine with guards, context, and serialisable state — not ad-hoc useState chains |
| Product engineering thinking | Understood activation rate problem, built the correct solution (gating, persistence, resume) |
| Feature gate system design | Two-condition gate (plan tier AND step completion) implemented as a composable wrapper component |
| Auth maturity | httpOnly refresh cookie + in-memory access token — not "just use localStorage" |
| State management discipline | Three Zustand stores with clear single responsibilities; derived store for gate state |
| Animation quality | Framer Motion step transitions and gate overlays — visual polish that separates senior from mid-level |
| Full-stack ownership | Owned backend schema, auth, API, and all frontend — not just a UI layer |
