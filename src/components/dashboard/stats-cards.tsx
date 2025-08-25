import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, CheckCircle, TrendingUp, Clock } from "lucide-react"

interface StatsCardsProps {
  totalLeads: number
  newLeads: number
  qualifiedLeads: number
  completedLeads: number
  recentLeads: number
}

export function StatsCards({ totalLeads, newLeads, qualifiedLeads, completedLeads, recentLeads }: StatsCardsProps) {
  const conversionRate = totalLeads > 0 ? Math.round((completedLeads / totalLeads) * 100) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <Card className="border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Leads</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{totalLeads}</div>
          <p className="text-xs text-gray-500 mt-1">All time</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">New Leads</CardTitle>
          <UserPlus className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{newLeads}</div>
          <p className="text-xs text-gray-500 mt-1">Awaiting contact</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Qualified</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{qualifiedLeads}</div>
          <p className="text-xs text-gray-500 mt-1">Ready to convert</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{completedLeads}</div>
          <p className="text-xs text-gray-500 mt-1">{conversionRate}% conversion</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">This Week</CardTitle>
          <Clock className="h-4 w-4 text-indigo-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{recentLeads}</div>
          <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
        </CardContent>
      </Card>
    </div>
  )
}
