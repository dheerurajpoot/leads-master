import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MobileCardProps {
  title?: string
  children: ReactNode
  className?: string
  headerActions?: ReactNode
  padding?: "none" | "sm" | "md" | "lg"
}

export function MobileCard({ title, children, className, headerActions, padding = "md" }: MobileCardProps) {
  const paddingClasses = {
    none: "p-0",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  }

  return (
    <Card className={cn("border-0 shadow-sm bg-white", className)}>
      {title && (
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {headerActions}
          </div>
        </CardHeader>
      )}
      <CardContent className={paddingClasses[padding]}>{children}</CardContent>
    </Card>
  )
}
