import { MobileCard } from "@/components/mobile/mobile-card"
import { Button } from "@/components/ui/button"
import { Plus, Download, BarChart3, Settings } from "lucide-react"
import Link from "next/link"

export function MobileQuickActions() {
  const actions = [
    {
      icon: Plus,
      label: "Add Lead",
      href: "/dashboard/leads/new",
      color: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    {
      icon: Download,
      label: "Export",
      href: "/dashboard/export",
      color: "bg-green-600 hover:bg-green-700 text-white",
    },
    {
      icon: BarChart3,
      label: "Analytics",
      href: "/dashboard/analytics",
      color: "bg-purple-600 hover:bg-purple-700 text-white",
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/dashboard/settings",
      color: "bg-gray-600 hover:bg-gray-700 text-white",
    },
  ]

  return (
    <MobileCard title="Quick Actions" padding="sm">
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link key={action.label} href={action.href}>
              <Button className={`w-full h-16 flex-col space-y-2 ${action.color}`}>
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            </Link>
          )
        })}
      </div>
    </MobileCard>
  )
}
