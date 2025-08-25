import { MobileCard } from "@/components/mobile/mobile-card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, TrendingUp } from "lucide-react"

interface Lead {
  id: string
  name: string
  email: string
  status: string
  form_type_id?: string
  created_at: string
}

interface FormType {
  id: string
  name: string
  leadCount: number
}

interface MobileAdminLeadsOverviewProps {
  leads: Lead[]
  leadsByFormType: FormType[]
}

export function MobileAdminLeadsOverview({ leads, leadsByFormType }: MobileAdminLeadsOverviewProps) {
  const statusCounts = {
    new: leads.filter((lead) => lead.status === "new").length,
    contacted: leads.filter((lead) => lead.status === "contacted").length,
    qualified: leads.filter((lead) => lead.status === "qualified").length,
    done: leads.filter((lead) => lead.status === "done").length,
  }

  const totalLeads = leads.length
  const conversionRate = totalLeads > 0 ? Math.round((statusCounts.done / totalLeads) * 100) : 0

  const getStatusBadge = (status: string, count: number) => {
    const variants = {
      new: "bg-orange-100 text-orange-800",
      contacted: "bg-blue-100 text-blue-800",
      qualified: "bg-green-100 text-green-800",
      done: "bg-purple-100 text-purple-800",
    }

    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <span className="text-sm font-medium capitalize">{status}</span>
        <Badge className={`${variants[status as keyof typeof variants]} text-xs`}>{count}</Badge>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Lead Status Overview */}
      <MobileCard title="Lead Status Overview" padding="sm">
        <div className="space-y-3">
          {Object.entries(statusCounts).map(([status, count]) => getStatusBadge(status, count))}

          <div className="pt-3 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Conversion Rate</span>
              <span className="text-sm font-bold text-purple-600">{conversionRate}%</span>
            </div>
            <Progress value={conversionRate} className="h-2" />
          </div>
        </div>
      </MobileCard>

      {/* Form Types Performance */}
      <MobileCard title="Form Performance" padding="sm">
        <div className="space-y-3">
          {leadsByFormType.slice(0, 5).map((formType) => (
            <div key={formType.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium">{formType.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold">{formType.leadCount}</span>
                <TrendingUp className="w-3 h-3 text-green-600" />
              </div>
            </div>
          ))}
        </div>
      </MobileCard>
    </div>
  )
}
