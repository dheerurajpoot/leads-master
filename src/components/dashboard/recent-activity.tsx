import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User } from "lucide-react"

interface Lead {
  id: string
  name: string
  email: string
  status: string
  created_at: string
}

interface RecentActivityProps {
  leads: Lead[]
}

export function RecentActivity({ leads }: RecentActivityProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      new: "bg-orange-100 text-orange-800",
      contacted: "bg-blue-100 text-blue-800",
      qualified: "bg-green-100 text-green-800",
      done: "bg-purple-100 text-purple-800",
    }
    return colors[status as keyof typeof colors] || colors.new
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leads.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent activity</p>
          ) : (
            leads.map((lead) => (
              <div key={lead.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">{lead.name}</p>
                    <Badge className={`text-xs ${getStatusColor(lead.status)}`}>{lead.status}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{lead.email}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(lead.created_at)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
