"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@/lib/supabase/client"
import { Shield, User, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { Users } from "lucide-react" // Import Users component

interface Profile {
  id: string
  full_name: string | null
  role: string
  is_admin: boolean
  created_at: string
}

interface AdminUsersTableProps {
  users: Profile[]
}

export function AdminUsersTable({ users: initialUsers }: AdminUsersTableProps) {
  const [users, setUsers] = useState(initialUsers)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    setIsUpdating(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("profiles").update({ is_admin: !currentStatus }).eq("id", userId)

      if (error) throw error

      // Update local state
      setUsers(users.map((user) => (user.id === userId ? { ...user, is_admin: !currentStatus } : user)))

      // If promoting to admin, create admin_users record
      if (!currentStatus) {
        await supabase.from("admin_users").upsert({ id: userId })
      }

      router.refresh()
    } catch (error) {
      console.error("Error updating admin status:", error)
      alert("Failed to update admin status")
    } finally {
      setIsUpdating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5" />
          User Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                          {user.is_admin ? (
                            <Shield className="w-4 h-4 text-red-600" />
                          ) : (
                            <User className="w-4 h-4 text-slate-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{user.full_name || "Unnamed User"}</div>
                          <div className="text-sm text-slate-500">ID: {user.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600 capitalize">{user.role}</span>
                    </TableCell>
                    <TableCell>
                      {user.is_admin ? (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                          <Shield className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                          <User className="w-3 h-3 mr-1" />
                          User
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">{formatDate(user.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant={user.is_admin ? "destructive" : "outline"}
                          onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                          disabled={isUpdating}
                          className="text-xs"
                        >
                          {user.is_admin ? (
                            <>
                              <User className="w-3 h-3 mr-1" />
                              Remove Admin
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3 h-3 mr-1" />
                              Make Admin
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
