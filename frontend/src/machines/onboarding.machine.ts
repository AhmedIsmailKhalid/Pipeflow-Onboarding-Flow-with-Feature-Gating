import { assign, createMachine } from 'xstate'
import { OnboardingContext, OnboardingEvent, StepAnswers } from './onboarding.types'
import { step1Valid, step2Valid, canSkipStep3, step4Valid } from './onboarding.guards'

const initialContext: OnboardingContext = {
  userId: '',
  currentStep: 1,
  completedSteps: [],
  stepAnswers: {},
  lastSyncedAt: null,
  error: null,
  isStarterPlan: false,
}

function mergeAnswers(
  existing: StepAnswers,
  incoming: Partial<StepAnswers> | undefined
): StepAnswers {
  if (!incoming) return existing
  return { ...existing, ...incoming }
}

function addCompleted(existing: number[], step: number): number[] {
  return existing.includes(step) ? existing : [...existing, step]
}

export const onboardingMachine = createMachine(
  {
    id: 'onboarding',
    types: {} as {
      context: OnboardingContext
      events: OnboardingEvent
    },
    context: initialContext,
    initial: 'idle',

    states: {
      idle: {
        on: {
          START: {
            target: 'step1',
            actions: assign(({ event }) => ({
              isStarterPlan: event.type === 'START' ? event.isStarterPlan : false,
            })),
          },
          RESTORE: {
            actions: 'applyRestoredProgress',
            target: 'restoredStep',
          },
        },
      },

      restoredStep: {
        always: [
          { guard: 'isRestoredStep1', target: 'step1' },
          { guard: 'isRestoredStep2', target: 'step2' },
          { guard: 'isRestoredStep3', target: 'step3' },
          { guard: 'isRestoredStep4', target: 'step4' },
          { guard: 'isRestoredStep5', target: 'step5' },
          { target: 'complete' },
        ],
      },

      step1: {
        entry: assign({ currentStep: 1 }),
        on: {
          NEXT: {
            guard: 'step1Valid',
            target: 'step2',
            actions: 'applyStep1Answers',
          },
          ABANDON: { target: 'idle', actions: 'clearError' },
        },
      },

      step2: {
        entry: assign({ currentStep: 2 }),
        on: {
          NEXT: [
            // Starter plan skips step 3 entirely — goes straight to step 4
            {
              guard: ({ context, event }) =>
                step2Valid({ context, event }) && context.isStarterPlan,
              target: 'step4',
              actions: ['applyStep2Answers', 'markStep3SkippedStarter'],
            },
            // Growth/Scale goes to step 3
            {
              guard: 'step2Valid',
              target: 'step3',
              actions: 'applyStep2Answers',
            },
          ],
          BACK: { target: 'step1' },
          ABANDON: { target: 'idle', actions: 'clearError' },
        },
      },

      step3: {
        entry: assign({ currentStep: 3 }),
        on: {
          NEXT: {
            target: 'step4',
            actions: 'applyStep3Answers',
          },
          SKIP: {
            guard: 'canSkipStep3',
            target: 'step4',
            actions: 'markStep3Skipped',
          },
          BACK: { target: 'step2' },
          ABANDON: { target: 'idle', actions: 'clearError' },
        },
      },

      step4: {
        entry: assign({ currentStep: 4 }),
        on: {
          NEXT: {
            guard: 'step4Valid',
            target: 'step5',
            actions: 'applyStep4Answers',
          },
          BACK: [
            // Starter goes back to step 2 (no step 3)
            {
              guard: ({ context }) => context.isStarterPlan,
              target: 'step2',
            },
            { target: 'step3' },
          ],
          ABANDON: { target: 'idle', actions: 'clearError' },
        },
      },

      step5: {
        entry: assign({ currentStep: 5 }),
        on: {
          GO_TO_DASHBOARD: { target: 'complete' },
        },
      },

      complete: {
        type: 'final',
      },
    },

    on: {
      SYNC_SUCCESS: {
        actions: assign({
          lastSyncedAt: ({ event }) => event.timestamp,
          error: null,
        }),
      },
      SYNC_ERROR: {
        actions: assign({ error: ({ event }) => event.message }),
      },
    },
  },
  {
    guards: {
      step1Valid,
      step2Valid,
      canSkipStep3,
      step4Valid,
      isRestoredStep1: ({ context }) => context.currentStep === 1,
      isRestoredStep2: ({ context }) => context.currentStep === 2,
      isRestoredStep3: ({ context }) => context.currentStep === 3,
      isRestoredStep4: ({ context }) => context.currentStep === 4,
      isRestoredStep5: ({ context }) => context.currentStep === 5,
    },

    actions: {
      applyRestoredProgress: assign(({ event }) => {
        if (event.type !== 'RESTORE') return {}
        return {
          completedSteps: event.progress.completedSteps,
          stepAnswers: event.progress.stepAnswers,
          currentStep: event.progress.lastActiveStep as OnboardingContext['currentStep'],
          isStarterPlan: event.progress.isStarterPlan,
          error: null,
        }
      }),

      applyStep1Answers: assign(({ context, event }) => {
        if (event.type !== 'NEXT') return {}
        return {
          stepAnswers: mergeAnswers(context.stepAnswers, event.answers),
          completedSteps: addCompleted(context.completedSteps, 1),
        }
      }),

      applyStep2Answers: assign(({ context, event }) => {
        if (event.type !== 'NEXT') return {}
        return {
          stepAnswers: mergeAnswers(context.stepAnswers, event.answers),
          completedSteps: addCompleted(context.completedSteps, 2),
        }
      }),

      applyStep3Answers: assign(({ context, event }) => {
        if (event.type !== 'NEXT') return {}
        return {
          stepAnswers: mergeAnswers(context.stepAnswers, event.answers),
          completedSteps: addCompleted(context.completedSteps, 3),
        }
      }),

      markStep3Skipped: assign(({ context }) => ({
        stepAnswers: mergeAnswers(context.stepAnswers, {
          step3: { connectedIntegrations: [] },
        }),
        // Skipped — not added to completedSteps
      })),

      // Starter plan auto-skip — marks step 3 as complete since
      // they never see the integrations step
      markStep3SkippedStarter: assign(({ context }) => ({
        stepAnswers: mergeAnswers(context.stepAnswers, {
          step3: { connectedIntegrations: [] },
        }),
        completedSteps: addCompleted(context.completedSteps, 3),
      })),

      applyStep4Answers: assign(({ context, event }) => {
        if (event.type !== 'NEXT') return {}
        return {
          stepAnswers: mergeAnswers(context.stepAnswers, event.answers),
          completedSteps: addCompleted(context.completedSteps, 4),
        }
      }),

      clearError: assign({ error: null }),
    },
  }
)