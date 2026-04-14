import { useParams } from 'react-router-dom'
import { TopNav } from '@/components/dashboard/TopNav'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { DashboardHome } from '@/components/dashboard/DashboardHome'
import { ProjectsView } from '@/components/dashboard/ProjectsView'
import { AnalyticsView } from '@/components/dashboard/AnalyticsView'
import { IntegrationsView } from '@/components/dashboard/IntegrationsView'
import { TeamView } from '@/components/dashboard/TeamView'
import { ReportsView } from '@/components/dashboard/ReportsView'
import { GatedFeature } from '@/components/feature-gate/GatedFeature'

const VIEW_MAP: Record<string, React.ReactNode> = {
  projects:     <GatedFeature featureKey="projects"><ProjectsView /></GatedFeature>,
  analytics:    <GatedFeature featureKey="analytics"><AnalyticsView /></GatedFeature>,
  integrations: <GatedFeature featureKey="integrations"><IntegrationsView /></GatedFeature>,
  team:         <GatedFeature featureKey="team_management"><TeamView /></GatedFeature>,
  reports:      <GatedFeature featureKey="reports"><ReportsView /></GatedFeature>,
}

export function DashboardPage() {
  const { view } = useParams<{ view?: string }>()
  const activeView = view ? VIEW_MAP[view] ?? <DashboardHome /> : <DashboardHome />

  return (
    <div className="h-screen flex overflow-hidden bg-canvas">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-6">
          {activeView}
        </main>
      </div>
    </div>
  )
}