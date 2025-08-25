import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function requireAdmin() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/admin/login")
  }

  // Check if user is admin
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  if (profileError || !profile?.is_admin) {
    redirect("/admin/login")
  }

  return { user, profile }
}

export async function checkAdminStatus(userId: string) {
  const supabase = await createClient()

  const { data: profile, error } = await supabase.from("profiles").select("is_admin").eq("id", userId).single()

  if (error) return false
  return profile?.is_admin || false
}

export async function getAdminPermissions(userId: string) {
  const supabase = await createClient()

  const { data: adminUser, error } = await supabase.from("admin_users").select("permissions").eq("id", userId).single()

  if (error) return null
  return adminUser?.permissions || null
}
