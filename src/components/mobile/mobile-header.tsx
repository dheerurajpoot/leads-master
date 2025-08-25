"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Menu } from "lucide-react"
import { useRouter } from "next/navigation"

interface MobileHeaderProps {
  title?: string
  showBack?: boolean
  onBack?: () => void
  actions?: ReactNode
  showMenu?: boolean
}

export function MobileHeader({ title, showBack = false, onBack, actions, showMenu = false }: MobileHeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50 safe-area-top">
      <div className="flex items-center justify-between px-4 py-3 min-h-[56px]">
        {/* Left Side */}
        <div className="flex items-center space-x-3">
          {showBack && (
            <Button variant="ghost" size="sm" onClick={handleBack} className="p-2 h-auto">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          {showMenu && (
            <Button variant="ghost" size="sm" className="p-2 h-auto">
              <Menu className="w-5 h-5" />
            </Button>
          )}
          {title && <h1 className="text-lg font-semibold text-foreground truncate">{title}</h1>}
        </div>

        {/* Right Side Actions */}
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>
    </header>
  )
}
