import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { MobileLayout } from "@/components/mobile/mobile-layout"
import { MobileStatsCards } from "@/components/dashboard/mobile-stats-cards"
import { MobileLeadsList } from "@/components/dashboard/mobile-leads-list"
import { MobileQuickActions } from "@/components/dashboard/mobile-quick-actions"
import { Button } from "@/components/ui/button"
import { Download, Plus } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch leads data
  const { data: leads, error: leadsError } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })

  if (leadsError) {
    console.error("Error fetching leads:", leadsError)
  }

  // Calculate stats
  const totalLeads = leads?.length || 0
  const newLeads = leads?.filter((lead) => lead.status === "new").length || 0
  const qualifiedLeads = leads?.filter((lead) => lead.status === "qualified").length || 0
  const completedLeads = leads?.filter((lead) => lead.status === "done").length || 0

  // Get recent leads (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const recentLeads = leads?.filter((lead) => new Date(lead.created_at) >= sevenDaysAgo).length || 0

  const headerActions = (
    <div className="flex items-center space-x-2">
      <Button size="sm" variant="outline" className="p-2 bg-transparent">
        <Download className="w-4 h-4" />
      </Button>
      <Button size="sm" className="p-2">
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  )

  return (
    <MobileLayout headerTitle="Dashboard" headerActions={headerActions}>
      <div className="space-y-6">
        {/* Mobile Stats Cards */}
        <MobileStatsCards
          totalLeads={totalLeads}
          newLeads={newLeads}
          qualifiedLeads={qualifiedLeads}
          completedLeads={completedLeads}
          recentLeads={recentLeads}
        />

        {/* Quick Actions */}
        <MobileQuickActions />

        {/* Mobile Leads List */}
        <MobileLeadsList leads={leads || []} />
      </div>
    </MobileLayout>
  )
}
