import { MobileCard } from "@/components/mobile/mobile-card"
import { Users, Shield, FileText, TrendingUp, UserPlus, Clock } from "lucide-react"

interface MobileAdminStatsCardsProps {
  totalLeads: number
  totalUsers: number
  totalAdmins: number
  activeFormTypes: number
  recentLeads: number
  recentUsers: number
}

export function MobileAdminStatsCards({
  totalLeads,
  totalUsers,
  totalAdmins,
  activeFormTypes,
  recentLeads,
  recentUsers,
}: MobileAdminStatsCardsProps) {
  const primaryStats = [
    {
      title: "Total Leads",
      value: totalLeads,
      subtitle: "All forms",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Team Members",
      value: totalUsers,
      subtitle: "Active users",
      icon: UserPlus,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Administrators",
      value: totalAdmins,
      subtitle: "Admin access",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Form Types",
      value: activeFormTypes,
      subtitle: "Active forms",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="space-y-4">
      {/* Primary Stats - 2x2 Grid */}
      <div className="grid grid-cols-2 gap-4">
        {primaryStats.map((stat) => {
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

      {/* Recent Activity Stats */}
      <div className="grid grid-cols-2 gap-4">
        <MobileCard padding="sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">{recentLeads}</div>
              <div className="text-sm text-muted-foreground">New leads</div>
              <div className="text-xs text-muted-foreground">This week</div>
            </div>
          </div>
        </MobileCard>

        <MobileCard padding="sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">{recentUsers}</div>
              <div className="text-sm text-muted-foreground">New users</div>
              <div className="text-xs text-muted-foreground">This week</div>
            </div>
          </div>
        </MobileCard>
      </div>
    </div>
  )
}
