"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye } from "lucide-react"
import Link from "next/link"

interface Lead {
  id: string
  name: string
  email: string
  status: string
  form_type_id: string
  created_at: string
}

interface FormTypeWithLeads {
  id: string
  name: string
  slug: string
  leadCount: number
}

interface AdminLeadsOverviewProps {
  leads: Lead[]
  leadsByFormType: FormTypeWithLeads[]
}

export function AdminLeadsOverview({ leads, leadsByFormType }: AdminLeadsOverviewProps) {
  const getStatusBadge = (status: string) => {
    const variants = {
      new: "bg-orange-100 text-orange-800",
      contacted: "bg-blue-100 text-blue-800",
      qualified: "bg-green-100 text-green-800",
      done: "bg-purple-100 text-purple-800",
    }

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.new}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const exportAllLeads = async () => {
    try {
      const response = await fetch("/api/export-leads")
      if (!response.ok) throw new Error("Export failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `admin-all-leads-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export error:", error)
      alert("Failed to export leads")
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Leads Overview
            </CardTitle>
            <Button onClick={exportAllLeads} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">By Form Type</h3>
              <div className="space-y-3">
                {leadsByFormType.map((formType) => (
                  <div key={formType.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium text-slate-900">{formType.name}</div>
                      <div className="text-sm text-slate-500">{formType.leadCount} leads</div>
                    </div>
                    <Link href={`/admin/leads?form=${formType.slug}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Recent Leads</h3>
              <div className="space-y-3">
                {leads.slice(0, 5).map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium text-slate-900">{lead.name}</div>
                      <div className="text-sm text-slate-500">{lead.email}</div>
                    </div>
                    <div className="flex items-center space-x-2">{getStatusBadge(lead.status)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
