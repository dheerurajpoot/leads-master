import { createClient } from "@/lib/supabase/server"
import { DynamicForm } from "@/components/dynamic-form"
import { MobileDynamicForm } from "@/components/mobile/mobile-dynamic-form"
import { MobileLayout } from "@/components/mobile/mobile-layout"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Zap, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function FormPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  // Verify form exists and is active
  const { data: formType, error } = await supabase
    .from("form_types")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (error || !formType) {
    notFound()
  }

  const headerActions = (
    <Link href="/">
      <Button variant="ghost" size="sm" className="p-2">
        <ArrowLeft className="w-4 h-4" />
      </Button>
    </Link>
  )

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:block min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">LeadMaster</span>
            </Link>
          </div>

          <div className="flex justify-center">
            <DynamicForm formSlug={slug} title={formType.name} description={formType.description} />
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <MobileLayout headerTitle={formType.name} headerActions={headerActions} showBottomNav={false} showHeader={true}>
          <MobileDynamicForm formSlug={slug} title={formType.name} description={formType.description} />
        </MobileLayout>
      </div>
    </>
  )
}
