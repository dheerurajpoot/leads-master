"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { CheckCircle } from "lucide-react"

interface FormField {
  name: string
  type: string
  label: string
  required: boolean
  options?: string[]
  placeholder?: string
}

interface FormType {
  id: string
  name: string
  slug: string
  description: string
  fields: FormField[]
}

interface DynamicFormProps {
  formSlug: string
  title?: string
  description?: string
}

export function DynamicForm({ formSlug, title, description }: DynamicFormProps) {
  const [formType, setFormType] = useState<FormType | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFormType = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("form_types")
          .select("*")
          .eq("slug", formSlug)
          .eq("is_active", true)
          .single()

        if (error) throw error
        setFormType(data)

        // Initialize form data with empty values
        const initialData: Record<string, any> = {}
        data.fields.forEach((field: FormField) => {
          initialData[field.name] = ""
        })
        setFormData(initialData)
      } catch (error) {
        setError("Form not found or inactive")
      } finally {
        setLoading(false)
      }
    }

    fetchFormType()
  }, [formSlug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()

      // Prepare submission data
      const submissionData = {
        ...formData,
        form_type_id: formType?.id,
        form_data: formData, // Store structured data
        status: "new",
      }

      const { error } = await supabase.from("leads").insert([submissionData])

      if (error) throw error

      setIsSubmitted(true)
      // Reset form data
      const resetData: Record<string, any> = {}
      formType?.fields.forEach((field: FormField) => {
        resetData[field.name] = ""
      })
      setFormData(resetData)
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }))
  }

  const renderField = (field: FormField) => {
    const commonProps = {
      id: field.name,
      required: field.required,
      value: formData[field.name] || "",
      className: "border-gray-300",
    }

    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "number":
        return (
          <Input
            {...commonProps}
            type={field.type}
            placeholder={field.placeholder}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
          />
        )

      case "textarea":
        return (
          <Textarea
            {...commonProps}
            rows={3}
            placeholder={field.placeholder}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
          />
        )

      case "select":
        return (
          <Select
            value={formData[field.name] || ""}
            onValueChange={(value) => handleFieldChange(field.name, value)}
            required={field.required}
          >
            <SelectTrigger className="border-gray-300">
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      default:
        return <Input {...commonProps} onChange={(e) => handleFieldChange(field.name, e.target.value)} />
    }
  }

  if (loading) {
    return (
      <Card className="w-full max-w-lg shadow-2xl border-0">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </CardContent>
      </Card>
    )
  }

  if (error && !formType) {
    return (
      <Card className="w-full max-w-lg shadow-2xl border-0">
        <CardContent className="p-8 text-center">
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-lg shadow-2xl border-0">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
          <p className="text-gray-600 mb-6">
            We've received your {formType?.name.toLowerCase()} and will get back to you within 24 hours.
          </p>
          <Button onClick={() => setIsSubmitted(false)} variant="outline" className="w-full">
            Submit Another {formType?.name}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-lg shadow-2xl border-0">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-gray-900">{title || formType?.name || "Contact Form"}</CardTitle>
        <CardDescription className="text-base">
          {description || formType?.description || "Fill out the form below and we'll contact you within 24 hours"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          {formType?.fields.map((field, index) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>
                {field.label} {field.required && "*"}
              </Label>
              {renderField(field)}
            </div>
          ))}

          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
