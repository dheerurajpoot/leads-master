import { requireAdmin } from "@/lib/admin/auth"
import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminFormsManager } from "@/components/admin/admin-forms-manager"

export default async function AdminFormsPage() {
  const { user } = await requireAdmin()
  const supabase = await createClient()

  // Fetch all form types
  const { data: formTypes, error } = await supabase
    .from("form_types")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching form types:", error)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader user={user} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Form Management</h1>
          <p className="text-slate-600">Create and manage different form types for lead capture</p>
        </div>

        <AdminFormsManager formTypes={formTypes || []} />
      </main>
    </div>
  )
}
