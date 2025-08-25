"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Mail, Phone, Calendar, User, MessageSquare, Save } from "lucide-react"
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
  assigned_to?: string
}

interface Profile {
  id: string
  full_name: string
}

interface LeadDetailsProps {
  lead: Lead
  profiles: Profile[]
}

export function LeadDetails({ lead: initialLead, profiles }: LeadDetailsProps) {
  const [lead, setLead] = useState(initialLead)
  const [notes, setNotes] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const updateLead = async (updates: Partial<Lead>) => {
    setIsUpdating(true)
    const supabase = createClient()

    const { error } = await supabase
      .from("leads")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", lead.id)

    if (error) {
      console.error("Error updating lead:", error)
      setIsUpdating(false)
      return
    }

    setLead({ ...lead, ...updates, updated_at: new Date().toISOString() })
    setIsUpdating(false)
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
      <Badge className={variants[status as keyof typeof variants] || variants.new}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getAssignedName = (assignedId?: string) => {
    if (!assignedId) return "Unassigned"
    const profile = profiles.find((p) => p.id === assignedId)
    return profile?.full_name || "Unknown"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Lead Details</h1>
        </div>
        {getStatusBadge(lead.status)}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <p className="text-lg font-semibold text-gray-900">{lead.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Company</label>
                  <p className="text-lg text-gray-900">{lead.company || "Not provided"}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900">{lead.email}</p>
                  </div>
                </div>
                {lead.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone</label>
                      <p className="text-gray-900">{lead.phone}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                {lead.phone && (
                  <Button variant="outline" className="bg-transparent">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Original Message */}
          {lead.message && (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Original Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{lead.message}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes Section */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Add Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add your notes about this lead..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="border-gray-300"
              />
              <Button className="mt-3 bg-blue-600 hover:bg-blue-700" disabled={!notes.trim()}>
                <Save className="w-4 h-4 mr-2" />
                Save Notes
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Lead Management */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Lead Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Status</label>
                <Select
                  value={lead.status}
                  onValueChange={(value) => updateLead({ status: value })}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="border-gray-300">
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

              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Assign To</label>
                <Select
                  value={lead.assigned_to || "unassigned"}
                  onValueChange={(value) => updateLead({ assigned_to: value === "unassigned" ? null : value })}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {profiles.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Lead Created</p>
                  <p className="text-xs text-gray-500">{formatDate(lead.created_at)}</p>
                </div>
              </div>
              {lead.updated_at !== lead.created_at && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Last Updated</p>
                    <p className="text-xs text-gray-500">{formatDate(lead.updated_at)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => updateLead({ status: "contacted" })}
                disabled={isUpdating}
              >
                Mark as Contacted
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => updateLead({ status: "qualified" })}
                disabled={isUpdating}
              >
                Mark as Qualified
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => updateLead({ status: "done" })}
                disabled={isUpdating}
              >
                Mark as Done
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
