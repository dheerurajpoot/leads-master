"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { createClient } from "@/lib/supabase/client"
import { FileText, Eye, Edit, Copy, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface FormType {
  id: string
  name: string
  slug: string
  description: string
  fields: any[]
  is_active: boolean
  created_at: string
  updated_at: string
}

interface AdminFormsManagerProps {
  formTypes: FormType[]
}

export function AdminFormsManager({ formTypes: initialFormTypes }: AdminFormsManagerProps) {
  const [formTypes, setFormTypes] = useState(initialFormTypes)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const toggleFormStatus = async (formId: string, currentStatus: boolean) => {
    setIsUpdating(true)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("form_types")
        .update({
          is_active: !currentStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", formId)

      if (error) throw error

      // Update local state
      setFormTypes(
        formTypes.map((form) =>
          form.id === formId ? { ...form, is_active: !currentStatus, updated_at: new Date().toISOString() } : form,
        ),
      )

      router.refresh()
    } catch (error) {
      console.error("Error updating form status:", error)
      alert("Failed to update form status")
    } finally {
      setIsUpdating(false)
    }
  }

  const copyFormUrl = (slug: string) => {
    const url = `${window.location.origin}/forms/${slug}`
    navigator.clipboard.writeText(url)
    alert("Form URL copied to clipboard!")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Form Types
            </CardTitle>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FileText className="w-4 h-4 mr-2" />
              Create New Form
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Form Details</TableHead>
                  <TableHead>Fields</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      No form types found
                    </TableCell>
                  </TableRow>
                ) : (
                  formTypes.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-slate-900">{form.name}</div>
                          <div className="text-sm text-slate-500">{form.description}</div>
                          <div className="text-xs text-slate-400">/{form.slug}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {form.fields.length} fields
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={form.is_active}
                            onCheckedChange={() => toggleFormStatus(form.id, form.is_active)}
                            disabled={isUpdating}
                          />
                          <span className="text-sm text-slate-600">{form.is_active ? "Active" : "Inactive"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">{formatDate(form.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Link href={`/forms/${form.slug}`} target="_blank">
                            <Button size="sm" variant="outline" className="text-xs bg-transparent">
                              <Eye className="w-3 h-3 mr-1" />
                              Preview
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyFormUrl(form.slug)}
                            className="text-xs"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy URL
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs bg-transparent">
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
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

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900">Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {formTypes
              .filter((form) => form.is_active)
              .map((form) => (
                <div key={form.id} className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-slate-900">{form.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">{form.description}</p>
                    </div>
                    <Link href={`/forms/${form.slug}`} target="_blank">
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Open
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
