import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, User, FileText, Shield } from "lucide-react"

interface Lead {
  id: string
  name: string
  email: string
  status: string
  created_at: string
}

interface Profile {
  id: string
  full_name: string | null
  is_admin: boolean
  created_at: string
}

interface AdminUser {
  id: string
  last_login: string | null
  profiles: {
    full_name: string | null
    is_admin: boolean
  }
}

interface AdminRecentActivityProps {
  leads: Lead[]
  users: Profile[]
  adminUsers: AdminUser[]
}

export function AdminRecentActivity({ leads, users, adminUsers }: AdminRecentActivityProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const recentActivity = [
    ...leads.slice(0, 3).map((lead) => ({
      type: "lead" as const,
      title: `New lead: ${lead.name}`,
      subtitle: lead.email,
      time: lead.created_at,
      status: lead.status,
    })),
    ...users.slice(0, 2).map((user) => ({
      type: "user" as const,
      title: `New user: ${user.full_name || "Unnamed"}`,
      subtitle: user.is_admin ? "Administrator" : "Marketing Team",
      time: user.created_at,
      isAdmin: user.is_admin,
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentActivity.length === 0 ? (
          <p className="text-slate-500 text-center py-4">No recent activity</p>
        ) : (
          recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border">
                {activity.type === "lead" ? (
                  <FileText className="w-4 h-4 text-blue-600" />
                ) : activity.isAdmin ? (
                  <Shield className="w-4 h-4 text-red-600" />
                ) : (
                  <User className="w-4 h-4 text-green-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-900 text-sm">{activity.title}</div>
                <div className="text-xs text-slate-500">{activity.subtitle}</div>
                <div className="text-xs text-slate-400 mt-1">{formatDate(activity.time)}</div>
              </div>
              {activity.type === "lead" && (
                <Badge className="text-xs bg-blue-100 text-blue-800">{activity.status}</Badge>
              )}
            </div>
          ))
        )}

        <div className="mt-6 pt-4 border-t border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-600" />
            Admin Activity
          </h4>
          {adminUsers.slice(0, 3).map((admin) => (
            <div key={admin.id} className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium text-slate-900">{admin.profiles.full_name || "Administrator"}</div>
                <div className="text-xs text-slate-500">
                  Last login: {admin.last_login ? formatDate(admin.last_login) : "Never"}
                </div>
              </div>
              <Badge className="bg-red-100 text-red-800 text-xs">Admin</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
