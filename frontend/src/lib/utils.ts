/**
 * Merges Tailwind class names safely.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Returns initials from a full name — max 2 characters.
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Formats a date string to a readable format.
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Calculates onboarding completion percentage.
 *
 * Required steps: 1, 2, 4 (step 3 is optional/skippable)
 * Step 3 counts as a bonus but is not required for 100%
 * 100% = steps 1, 2, 4 all complete
 */
export function getOnboardingPercentage(
  completedSteps: number[],
  isStarterPlan: boolean = false
): number {
  const requiredSteps = isStarterPlan ? [1, 2, 4] : [1, 2, 3, 4]
  const completed = requiredSteps.filter((s) => completedSteps.includes(s)).length
  return Math.round((completed / requiredSteps.length) * 100)
}

/**
 * Returns the next incomplete required step number.
 */
export function getNextIncompleteStep(
  completedSteps: number[],
  isStarterPlan: boolean = false
): number {
  const requiredSteps = isStarterPlan ? [1, 2, 4] : [1, 2, 3, 4]
  for (const step of requiredSteps) {
    if (!completedSteps.includes(step)) return step
  }
  return 5
}