import { MobileCard } from "@/components/mobile/mobile-card"
import { Button } from "@/components/ui/button"
import { Users, FileText, Shield, BarChart3, Settings, Download } from "lucide-react"
import Link from "next/link"

export function MobileAdminQuickActions() {
  const actions = [
    {
      icon: Users,
      label: "Manage Users",
      href: "/admin/users",
      color: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    {
      icon: FileText,
      label: "Form Types",
      href: "/admin/forms",
      color: "bg-green-600 hover:bg-green-700 text-white",
    },
    {
      icon: Shield,
      label: "Admin Roles",
      href: "/admin/roles",
      color: "bg-red-600 hover:bg-red-700 text-white",
    },
    {
      icon: BarChart3,
      label: "Analytics",
      href: "/admin/analytics",
      color: "bg-purple-600 hover:bg-purple-700 text-white",
    },
    {
      icon: Download,
      label: "Export Data",
      href: "/admin/export",
      color: "bg-orange-600 hover:bg-orange-700 text-white",
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/admin/settings",
      color: "bg-gray-600 hover:bg-gray-700 text-white",
    },
  ]

  return (
    <MobileCard title="Admin Actions" padding="sm">
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
