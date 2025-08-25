"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"
import { Search, Phone, Mail, Building, Eye, Trash2, UserPlus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  message?: string
  status: string
  created_at: string
  updated_at: string
}

interface LeadsTableProps {
  leads: Lead[]
}

export function LeadsTable({ leads: initialLeads }: LeadsTableProps) {
  const [leads, setLeads] = useState(initialLeads)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || lead.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    const supabase = createClient()

    const { error } = await supabase
      .from("leads")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", leadId)

    if (error) {
      console.error("Error updating lead:", error)
      return
    }

    // Update local state
    setLeads(
      leads.map((lead) =>
        lead.id === leadId ? { ...lead, status: newStatus, updated_at: new Date().toISOString() } : lead,
      ),
    )

    router.refresh()
  }

  const bulkUpdateStatus = async (newStatus: string) => {
    if (selectedLeads.length === 0) return

    setIsUpdating(true)
    const supabase = createClient()

    const { error } = await supabase
      .from("leads")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .in("id", selectedLeads)

    if (error) {
      console.error("Error bulk updating leads:", error)
      setIsUpdating(false)
      return
    }

    // Update local state
    setLeads(
      leads.map((lead) =>
        selectedLeads.includes(lead.id) ? { ...lead, status: newStatus, updated_at: new Date().toISOString() } : lead,
      ),
    )

    setSelectedLeads([])
    setIsUpdating(false)
    router.refresh()
  }

  const deleteSelectedLeads = async () => {
    if (selectedLeads.length === 0) return

    setIsUpdating(true)
    const supabase = createClient()

    const { error } = await supabase.from("leads").delete().in("id", selectedLeads)

    if (error) {
      console.error("Error deleting leads:", error)
      setIsUpdating(false)
      return
    }

    // Update local state
    setLeads(leads.filter((lead) => !selectedLeads.includes(lead.id)))
    setSelectedLeads([])
    setIsUpdating(false)
    router.refresh()
  }

  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeads((prev) => (prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]))
  }

  const toggleAllSelection = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([])
    } else {
      setSelectedLeads(filteredLeads.map((lead) => lead.id))
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      new: "bg-orange-100 text-orange-800 hover:bg-orange-200",
      contacted: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      qualified: "bg-green-100 text-green-800 hover:bg-green-200",
      done: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    }

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.new}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const exportFilteredLeads = async () => {
    if (filteredLeads.length === 0) return

    try {
      // Create CSV content for filtered leads
      const csvHeaders = ["Name", "Email", "Phone", "Company", "Message", "Status", "Created Date", "Last Updated"]

      const csvRows = filteredLeads.map((lead) => [
        lead.name || "",
        lead.email || "",
        lead.phone || "",
        lead.company || "",
        (lead.message || "").replace(/"/g, '""'), // Escape quotes in message
        lead.status || "",
        new Date(lead.created_at).toLocaleDateString("en-US"),
        new Date(lead.updated_at).toLocaleDateString("en-US"),
      ])

      // Create CSV content
      const csvContent = [
        csvHeaders.join(","),
        ...csvRows.map((row) =>
          row
            .map((field) =>
              typeof field === "string" && (field.includes(",") || field.includes('"') || field.includes("\n"))
                ? `"${field}"`
                : field,
            )
            .join(","),
        ),
      ].join("\n")

      // Create download
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url

      const filterSuffix = statusFilter !== "all" ? `-${statusFilter}` : ""
      const searchSuffix = searchTerm ? `-filtered` : ""
      link.download = `leadmaster-leads${filterSuffix}${searchSuffix}-${new Date().toISOString().split("T")[0]}.csv`

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export error:", error)
      alert("Failed to export leads. Please try again.")
    }
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900">All Leads</CardTitle>
          {filteredLeads.length > 0 && (
            <Button variant="outline" size="sm" onClick={exportFilteredLeads} className="bg-transparent">
              <Search className="w-3 h-3 mr-2" />
              Export Filtered ({filteredLeads.length})
            </Button>
          )}
        </div>

        {selectedLeads.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-sm font-medium text-blue-900">
              {selectedLeads.length} lead{selectedLeads.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => bulkUpdateStatus("contacted")}
                disabled={isUpdating}
                className="bg-white"
              >
                <UserPlus className="w-3 h-3 mr-1" />
                Mark Contacted
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => bulkUpdateStatus("qualified")}
                disabled={isUpdating}
                className="bg-white"
              >
                Mark Qualified
              </Button>
              <Button size="sm" variant="destructive" onClick={deleteSelectedLeads} disabled={isUpdating}>
                <Trash2 className="w-3 h-3 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 border-gray-300">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                    onCheckedChange={toggleAllSelection}
                  />
                </TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No leads found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id} className={selectedLeads.includes(lead.id) ? "bg-blue-50" : ""}>
                    <TableCell>
                      <Checkbox
                        checked={selectedLeads.includes(lead.id)}
                        onCheckedChange={() => toggleLeadSelection(lead.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">{lead.name}</div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="w-3 h-3 mr-1" />
                          {lead.email}
                        </div>
                        {lead.phone && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="w-3 h-3 mr-1" />
                            {lead.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {lead.company ? (
                        <div className="flex items-center text-sm">
                          <Building className="w-3 h-3 mr-1 text-gray-400" />
                          {lead.company}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(lead.status)}</TableCell>
                    <TableCell className="text-sm text-gray-500">{formatDate(lead.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Link href={`/dashboard/leads/${lead.id}`}>
                          <Button size="sm" variant="outline" className="bg-transparent">
                            <Eye className="w-3 h-3" />
                          </Button>
                        </Link>
                        <Select value={lead.status} onValueChange={(value) => updateLeadStatus(lead.id, value)}>
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="qualified">Qualified</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                          </SelectContent>
                        </Select>
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
