import { FeatureKey, Plan, PlanFeatureGate } from '@/types/plan.types'

export const PLAN_HIERARCHY: Record<Plan, number> = {
  STARTER: 0,
  GROWTH:  1,
  SCALE:   2,
}

export const PLAN_LABELS: Record<Plan, string> = {
  STARTER: 'Starter',
  GROWTH:  'Growth',
  SCALE:   'Scale',
}

export const PLAN_COLORS: Record<Plan, string> = {
  STARTER: 'bg-slate-100 text-slate-700',
  GROWTH:  'bg-blue-100 text-blue-700',
  SCALE:   'bg-purple-100 text-purple-700',
}

export const FEATURE_GATE_MAP: Record<FeatureKey, PlanFeatureGate> = {
  projects: {
    minPlan: 'STARTER',
    requiredStep: 1,
    label: 'Projects',
    description: 'Create and manage projects',
  },
  analytics: {
    minPlan: 'STARTER',
    requiredStep: 2,
    label: 'Analytics',
    description: 'View usage analytics and insights',
  },
  integrations: {
    minPlan: 'GROWTH',
    label: 'Integrations',
    description: 'Connect Slack, GitHub, Jira and more',
  },
  team_management: {
    minPlan: 'GROWTH',
    requiredStep: 2,
    label: 'Team Management',
    description: 'Invite and manage team members',
  },
  custom_branding: {
    minPlan: 'GROWTH',
    label: 'Custom Branding',
    description: 'Add your logo and brand colours',
  },
  reports: {
    minPlan: 'SCALE',
    label: 'Reports',
    description: 'Advanced reporting and exports',
  },
  api_access: {
    minPlan: 'SCALE',
    label: 'API Access',
    description: 'Programmatic access via REST API',
  },
}

// Starter sees 4 steps — no integrations step
export const ONBOARDING_STEPS_STARTER = [
  { step: 1, label: 'Profile',   description: 'Tell us about yourself' },
  { step: 2, label: 'Workspace', description: 'Set up your workspace' },
  { step: 3, label: 'Tour',      description: 'See what Pipeflow can do' },
  { step: 4, label: 'Done',      description: "You're all set" },
] as const

// Growth/Scale sees 5 steps — includes integrations
export const ONBOARDING_STEPS_FULL = [
  { step: 1, label: 'Profile',      description: 'Tell us about yourself' },
  { step: 2, label: 'Workspace',    description: 'Set up your workspace' },
  { step: 3, label: 'Integrations', description: 'Connect your tools' },
  { step: 4, label: 'Tour',         description: 'See what Pipeflow can do' },
  { step: 5, label: 'Done',         description: "You're all set" },
] as const

export const INTEGRATIONS = [
  { id: 'slack',  name: 'Slack',  icon: '/images/integrations/slack.svg' },
  { id: 'github', name: 'GitHub', icon: '/images/integrations/github.svg' },
  { id: 'jira',   name: 'Jira',   icon: '/images/integrations/jira.svg' },
  { id: 'notion', name: 'Notion', icon: '/images/integrations/notion.svg' },
  { id: 'figma',  name: 'Figma',  icon: '/images/integrations/figma.svg' },
  { id: 'linear', name: 'Linear', icon: '/images/integrations/linear.svg' },
] as const