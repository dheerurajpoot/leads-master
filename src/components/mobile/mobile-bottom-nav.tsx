"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Users, BarChart3, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    href: "/dashboard",
    icon: Home,
    label: "Dashboard",
    activePattern: /^\/dashboard$/,
  },
  {
    href: "/dashboard/leads",
    icon: Users,
    label: "Leads",
    activePattern: /^\/dashboard\/leads/,
  },
  {
    href: "/dashboard/analytics",
    icon: BarChart3,
    label: "Analytics",
    activePattern: /^\/dashboard\/analytics/,
  },
  {
    href: "/dashboard/profile",
    icon: User,
    label: "Profile",
    activePattern: /^\/dashboard\/profile/,
  },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border safe-area-bottom z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = item.activePattern.test(pathname)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors min-w-[60px]",
                isActive ? "text-blue-600 bg-blue-50" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
