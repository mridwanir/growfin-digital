import { DashboardOverview } from '@/features/dashboard'
import { getDashboardOverviewData } from '@/features/dashboard/server'

export default async function DashboardPage() {
  const { currentTenant, metrics } = await getDashboardOverviewData()

  return <DashboardOverview metrics={metrics} tenant={currentTenant} />
}
