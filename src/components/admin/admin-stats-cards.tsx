import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Shield, FileText, TrendingUp, Clock, UserPlus } from "lucide-react"

interface AdminStatsCardsProps {
  totalLeads: number
  totalUsers: number
  totalAdmins: number
  activeFormTypes: number
  recentLeads: number
  recentUsers: number
}

export function AdminStatsCards({
  totalLeads,
  totalUsers,
  totalAdmins,
  activeFormTypes,
  recentLeads,
  recentUsers,
}: AdminStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
      <Card className="border-0 shadow-md bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-100">Total Leads</CardTitle>
          <FileText className="h-4 w-4 text-blue-200" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalLeads}</div>
          <p className="text-xs text-blue-100 mt-1">All form types</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md bg-gradient-to-br from-green-500 to-green-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-100">Total Users</CardTitle>
          <Users className="h-4 w-4 text-green-200" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
          <p className="text-xs text-green-100 mt-1">Marketing team</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md bg-gradient-to-br from-red-500 to-red-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-100">Administrators</CardTitle>
          <Shield className="h-4 w-4 text-red-200" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAdmins}</div>
          <p className="text-xs text-red-100 mt-1">System admins</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-100">Active Forms</CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-200" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeFormTypes}</div>
          <p className="text-xs text-purple-100 mt-1">Form types</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-100">This Week</CardTitle>
          <Clock className="h-4 w-4 text-orange-200" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{recentLeads}</div>
          <p className="text-xs text-orange-100 mt-1">New leads</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-indigo-100">New Users</CardTitle>
          <UserPlus className="h-4 w-4 text-indigo-200" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{recentUsers}</div>
          <p className="text-xs text-indigo-100 mt-1">Last 7 days</p>
        </CardContent>
      </Card>
    </div>
  )
}
