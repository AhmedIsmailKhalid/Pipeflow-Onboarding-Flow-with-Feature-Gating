export type Plan = 'STARTER' | 'GROWTH' | 'SCALE'

export type FeatureKey =
  | 'projects'
  | 'analytics'
  | 'integrations'
  | 'team_management'
  | 'custom_branding'
  | 'reports'
  | 'api_access'

export interface PlanFeatureGate {
  minPlan: Plan
  requiredStep?: number
  label: string
  description: string
}

export interface PlanInfo {
  plan: Plan
  features: FeatureKey[]
}