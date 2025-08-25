"use client"

import { useState } from "react"
import { MobileCard } from "@/components/mobile/mobile-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { Search, Shield, User, Crown } from "lucide-react"
import { useRouter } from "next/navigation"

interface Profile {
  id: string
  full_name: string
  email?: string
  is_admin: boolean
  created_at: string
}

interface MobileAdminUsersTableProps {
  users: Profile[]
}

export function MobileAdminUsersTable({ users: initialUsers }: MobileAdminUsersTableProps) {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    const supabase = createClient()

    const { error } = await supabase.from("profiles").update({ is_admin: !currentStatus }).eq("id", userId)

    if (error) {
      console.error("Error updating admin status:", error)
      return
    }

    setUsers(users.map((user) => (user.id === userId ? { ...user, is_admin: !currentStatus } : user)))

    router.refresh()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <MobileCard title="Team Management" padding="none">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 mobile-input"
          />
        </div>
      </div>

      <div className="divide-y divide-border">
        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>No users found</p>
          </div>
        ) : (
          filteredUsers.slice(0, 10).map((user) => (
            <div key={user.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      user.is_admin ? "bg-red-50" : "bg-blue-50"
                    }`}
                  >
                    {user.is_admin ? (
                      <Crown className="w-5 h-5 text-red-600" />
                    ) : (
                      <User className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{user.full_name}</h3>
                    {user.email && <p className="text-sm text-muted-foreground">{user.email}</p>}
                  </div>
                </div>
                <Badge className={user.is_admin ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}>
                  {user.is_admin ? "Admin" : "User"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Joined {formatDate(user.created_at)}</span>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant={user.is_admin ? "destructive" : "default"}
                    onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                    className="text-xs"
                  >
                    {user.is_admin ? (
                      <>
                        <Shield className="w-3 h-3 mr-1" />
                        Remove Admin
                      </>
                    ) : (
                      <>
                        <Crown className="w-3 h-3 mr-1" />
                        Make Admin
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </MobileCard>
  )
}
