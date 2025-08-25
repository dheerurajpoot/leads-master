"use client"

import type { ReactNode } from "react"
import { MobileBottomNav } from "./mobile-bottom-nav"
import { MobileHeader } from "./mobile-header"

interface MobileLayoutProps {
  children: ReactNode
  showBottomNav?: boolean
  showHeader?: boolean
  headerTitle?: string
  headerActions?: ReactNode
}

export function MobileLayout({
  children,
  showBottomNav = true,
  showHeader = true,
  headerTitle,
  headerActions,
}: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mobile Header */}
      {showHeader && <MobileHeader title={headerTitle} actions={headerActions} />}

      {/* Main Content */}
      <main className={`flex-1 overflow-auto ${showBottomNav ? "pb-20" : "pb-4"}`}>
        <div className="px-4 py-4">{children}</div>
      </main>

      {/* Bottom Navigation */}
      {showBottomNav && <MobileBottomNav />}
    </div>
  )
}
