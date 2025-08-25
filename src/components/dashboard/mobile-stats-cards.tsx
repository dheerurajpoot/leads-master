import { MobileCard } from "@/components/mobile/mobile-card"
import { Users, UserPlus, CheckCircle, TrendingUp, Clock } from "lucide-react"

interface MobileStatsCardsProps {
  totalLeads: number
  newLeads: number
  qualifiedLeads: number
  completedLeads: number
  recentLeads: number
}

export function MobileStatsCards({
  totalLeads,
  newLeads,
  qualifiedLeads,
  completedLeads,
  recentLeads,
}: MobileStatsCardsProps) {
  const conversionRate = totalLeads > 0 ? Math.round((completedLeads / totalLeads) * 100) : 0

  const stats = [
    {
      title: "Total Leads",
      value: totalLeads,
      subtitle: "All time",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "New Leads",
      value: newLeads,
      subtitle: "Awaiting contact",
      icon: UserPlus,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Qualified",
      value: qualifiedLeads,
      subtitle: "Ready to convert",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Completed",
      value: completedLeads,
      subtitle: `${conversionRate}% conversion`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="space-y-4">
      {/* Primary Stats - 2x2 Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <MobileCard key={stat.title} className="text-center" padding="sm">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-foreground mb-1">{stat.title}</div>
              <div className="text-xs text-muted-foreground">{stat.subtitle}</div>
            </MobileCard>
          )
        })}
      </div>

      {/* Weekly Stats */}
      <MobileCard padding="sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">{recentLeads}</div>
              <div className="text-sm text-muted-foreground">This week</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Last 7 days</div>
          </div>
        </div>
      </MobileCard>
    </div>
  )
}
