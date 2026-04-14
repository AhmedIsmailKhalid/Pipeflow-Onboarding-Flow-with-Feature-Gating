export interface OnboardingProgressResponse {
  completedSteps: number[]
  stepAnswers: Record<string, unknown>
  lastActiveStep: number
}