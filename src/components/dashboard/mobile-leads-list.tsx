"use client"

import { useState } from "react"
import { MobileCard } from "@/components/mobile/mobile-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { Search, Phone, Mail, Building, ChevronRight, Filter, Users } from "lucide-react"
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

interface MobileLeadsListProps {
  leads: Lead[]
}

export function MobileLeadsList({ leads: initialLeads }: MobileLeadsListProps) {
  const [leads, setLeads] = useState(initialLeads)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
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

    setLeads(
      leads.map((lead) =>
        lead.id === leadId ? { ...lead, status: newStatus, updated_at: new Date().toISOString() } : lead,
      ),
    )

    router.refresh()
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      new: "bg-orange-100 text-orange-800",
      contacted: "bg-blue-100 text-blue-800",
      qualified: "bg-green-100 text-green-800",
      done: "bg-purple-100 text-purple-800",
    }

    return (
      <Badge className={`${variants[status as keyof typeof variants] || variants.new} text-xs`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <MobileCard
      title="Recent Leads"
      headerActions={
        <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)} className="p-2">
          <Filter className="w-4 h-4" />
        </Button>
      }
      padding="none"
    >
      <div className="p-4 border-b border-border">
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 mobile-input"
            />
          </div>

          {/* Filters */}
          {showFilters && (
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="mobile-input">
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
          )}
        </div>
      </div>

      <div className="divide-y divide-border">
        {filteredLeads.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>No leads found</p>
          </div>
        ) : (
          filteredLeads.slice(0, 10).map((lead) => (
            <div key={lead.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground truncate">{lead.name}</h3>
                    {getStatusBadge(lead.status)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span className="truncate">{lead.email}</span>
                    </div>
                    {lead.phone && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="w-3 h-3 mr-2 flex-shrink-0" />
                        <span>{lead.phone}</span>
                      </div>
                    )}
                    {lead.company && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Building className="w-3 h-3 mr-2 flex-shrink-0" />
                        <span className="truncate">{lead.company}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Link href={`/dashboard/leads/${lead.id}`}>
                  <Button variant="ghost" size="sm" className="p-2 ml-2">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{formatDate(lead.created_at)}</span>
                <div className="flex space-x-2">
                  <Select value={lead.status} onValueChange={(value) => updateLeadStatus(lead.id, value)}>
                    <SelectTrigger className="w-24 h-8 text-xs">
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
              </div>
            </div>
          ))
        )}
      </div>

      {filteredLeads.length > 10 && (
        <div className="p-4 border-t border-border">
          <Link href="/dashboard/leads">
            <Button variant="outline" className="w-full mobile-button bg-transparent">
              View All Leads ({filteredLeads.length})
            </Button>
          </Link>
        </div>
      )}
    </MobileCard>
  )
}
