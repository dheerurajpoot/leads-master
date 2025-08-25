"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { MobileCard } from "@/components/mobile/mobile-card"
import { createClient } from "@/lib/supabase/client"
import { CheckCircle, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"

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

interface MobileDynamicFormProps {
  formSlug: string
  title?: string
  description?: string
}

export function MobileDynamicForm({ formSlug, title, description }: MobileDynamicFormProps) {
  const [formType, setFormType] = useState<FormType | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Group fields into steps (3-4 fields per step for mobile)
  const fieldsPerStep = 3
  const totalSteps = formType ? Math.ceil(formType.fields.length / fieldsPerStep) : 0
  const currentFields = formType?.fields.slice(currentStep * fieldsPerStep, (currentStep + 1) * fieldsPerStep) || []

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

  const validateCurrentStep = () => {
    const errors: Record<string, string> = {}
    let isValid = true

    currentFields.forEach((field) => {
      if (field.required && (!formData[field.name] || formData[field.name].toString().trim() === "")) {
        errors[field.name] = `${field.label} is required`
        isValid = false
      }

      // Email validation
      if (field.type === "email" && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData[field.name])) {
          errors[field.name] = "Please enter a valid email address"
          isValid = false
        }
      }

      // Phone validation
      if (field.type === "tel" && formData[field.name]) {
        const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
        if (!phoneRegex.test(formData[field.name].replace(/\D/g, ""))) {
          errors[field.name] = "Please enter a valid phone number"
          isValid = false
        }
      }
    })

    setFieldErrors(errors)
    return isValid
  }

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1))
      setFieldErrors({})
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
    setFieldErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateCurrentStep()) {
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()

      // Prepare submission data
      const submissionData = {
        ...formData,
        form_type_id: formType?.id,
        form_data: formData,
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
      setCurrentStep(0)
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }))
    // Clear field error when user starts typing
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => ({ ...prev, [fieldName]: "" }))
    }
  }

  const renderField = (field: FormField) => {
    const hasError = !!fieldErrors[field.name]
    const commonProps = {
      id: field.name,
      required: field.required,
      value: formData[field.name] || "",
      className: `mobile-input ${hasError ? "border-red-500 focus:border-red-500" : ""}`,
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
            rows={4}
            placeholder={field.placeholder}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={`mobile-input resize-none ${hasError ? "border-red-500 focus:border-red-500" : ""}`}
          />
        )

      case "select":
        return (
          <Select
            value={formData[field.name] || ""}
            onValueChange={(value) => handleFieldChange(field.name, value)}
            required={field.required}
          >
            <SelectTrigger className={`mobile-input ${hasError ? "border-red-500" : ""}`}>
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
      <MobileCard className="text-center" padding="lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading form...</p>
      </MobileCard>
    )
  }

  if (error && !formType) {
    return (
      <MobileCard className="text-center" padding="lg">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">{error}</p>
      </MobileCard>
    )
  }

  if (isSubmitted) {
    return (
      <MobileCard className="text-center" padding="lg">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-4">Thank You!</h3>
        <p className="text-muted-foreground mb-8 text-lg">
          We've received your {formType?.name.toLowerCase()} and will get back to you within 24 hours.
        </p>
        <Button onClick={() => setIsSubmitted(false)} variant="outline" className="mobile-button">
          Submit Another {formType?.name}
        </Button>
      </MobileCard>
    )
  }

  const progressPercentage = totalSteps > 1 ? ((currentStep + 1) / totalSteps) * 100 : 100

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      {totalSteps > 1 && (
        <MobileCard padding="sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </MobileCard>
      )}

      {/* Form Card */}
      <MobileCard padding="lg">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-3">{title || formType?.name || "Contact Form"}</h2>
          <p className="text-muted-foreground text-lg">
            {description || formType?.description || "Fill out the form below and we'll contact you within 24 hours"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentFields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name} className="text-base font-medium">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </Label>
              {renderField(field)}
              {fieldErrors[field.name] && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {fieldErrors[field.name]}
                </p>
              )}
            </div>
          ))}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex space-x-4 pt-4">
            {currentStep > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                className="flex-1 mobile-button bg-transparent"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}

            {currentStep < totalSteps - 1 ? (
              <Button type="button" onClick={handleNext} className="flex-1 mobile-button bg-blue-600 hover:bg-blue-700">
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="flex-1 mobile-button bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            )}
          </div>
        </form>
      </MobileCard>
    </div>
  )
}
