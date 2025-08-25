"use client"

import { useEffect, useState } from "react"
import { DynamicForm } from "@/components/dynamic-form"
import { MobileDynamicForm } from "@/components/mobile/mobile-dynamic-form"

interface MobileFormWrapperProps {
  formSlug: string
  title?: string
  description?: string
}

export function MobileFormWrapper({ formSlug, title, description }: MobileFormWrapperProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (isMobile) {
    return <MobileDynamicForm formSlug={formSlug} title={title} description={description} />
  }

  return <DynamicForm formSlug={formSlug} title={title} description={description} />
}
