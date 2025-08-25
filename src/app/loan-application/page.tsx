import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { DynamicForm } from "@/components/dynamic-form"
import { MobileDynamicForm } from "@/components/mobile/mobile-dynamic-form"
import { MobileLayout } from "@/components/mobile/mobile-layout"
import { LoanCalculator } from "@/components/loan-calculator"
import { MobileLoanCalculator } from "@/components/mobile/mobile-loan-calculator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Zap, Shield, Clock, CheckCircle, Calculator, FileText, Users, ArrowLeft } from "lucide-react"

export default async function LoanApplicationPage() {
  const supabase = await createClient()

  // Verify loan form exists
  const { data: loanForm } = await supabase
    .from("form_types")
    .select("*")
    .eq("slug", "loan")
    .eq("is_active", true)
    .single()

  const headerActions = (
    <Link href="/">
      <Button variant="ghost" size="sm" className="p-2">
        <ArrowLeft className="w-4 h-4" />
      </Button>
    </Link>
  )

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:block min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">LeadMaster</span>
              <Badge className="bg-green-100 text-green-800 ml-2">Loan Center</Badge>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline" className="font-medium bg-transparent">
                  Team Login
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Loan Application Center</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Apply for your loan with confidence. Our streamlined process ensures quick approval and competitive
                rates.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 mb-16">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-gray-600 font-medium">Bank-Level Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-green-600" />
                <span className="text-gray-600 font-medium">24-Hour Response</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-600 font-medium">No Hidden Fees</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Loan Calculator */}
              <div className="lg:col-span-1">
                <LoanCalculator />
              </div>

              {/* Application Form */}
              <div className="lg:col-span-2">
                <div className="flex justify-center">
                  {loanForm ? (
                    <DynamicForm
                      formSlug="loan"
                      title="Loan Application"
                      description="Complete the form below to start your loan application process"
                    />
                  ) : (
                    <Card className="w-full max-w-lg shadow-2xl border-0">
                      <CardContent className="p-8 text-center">
                        <p className="text-red-600">Loan application form is currently unavailable.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Loan Types Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Loan Types We Offer</h2>
              <p className="text-xl text-gray-600">
                Choose from our comprehensive range of loan products designed to meet your specific needs.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Personal Loans</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base mb-4">
                    Flexible personal loans for any purpose with competitive rates and quick approval.
                  </CardDescription>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• $1,000 - $50,000</li>
                    <li>• 2-7 year terms</li>
                    <li>• Fixed rates from 5.99%</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Business Loans</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base mb-4">
                    Fuel your business growth with our tailored business financing solutions.
                  </CardDescription>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• $5,000 - $500,000</li>
                    <li>• 1-10 year terms</li>
                    <li>• Competitive rates</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Calculator className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">Auto Loans</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base mb-4">
                    Get behind the wheel of your dream car with our auto financing options.
                  </CardDescription>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• New & used vehicles</li>
                    <li>• Up to 84 months</li>
                    <li>• Rates from 3.99%</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple Application Process</h2>
              <p className="text-xl text-gray-600">
                Get approved in just a few easy steps with our streamlined loan application process.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: "1", title: "Apply Online", description: "Complete our secure online application in minutes" },
                { step: "2", title: "Quick Review", description: "Our team reviews your application within 24 hours" },
                { step: "3", title: "Get Approved", description: "Receive your loan decision and terms quickly" },
                { step: "4", title: "Receive Funds", description: "Get your funds deposited directly to your account" },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">LeadMaster Loans</span>
              </div>
              <p className="text-gray-400">© 2024 LeadMaster. All rights reserved. Licensed Lender.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <MobileLayout
          headerTitle="Loan Application"
          headerActions={headerActions}
          showBottomNav={false}
          showHeader={true}
        >
          <div className="space-y-6">
            {/* Mobile Trust Indicators */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-center space-x-2 p-3 bg-green-50 rounded-lg">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">Bank-Level Security</span>
              </div>
              <div className="flex items-center justify-center space-x-2 p-3 bg-blue-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-blue-800 font-medium">24-Hour Response</span>
              </div>
              <div className="flex items-center justify-center space-x-2 p-3 bg-purple-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-purple-600" />
                <span className="text-purple-800 font-medium">No Hidden Fees</span>
              </div>
            </div>

            {/* Mobile Loan Calculator */}
            <MobileLoanCalculator />

            {/* Mobile Application Form */}
            {loanForm ? (
              <MobileDynamicForm
                formSlug="loan"
                title="Loan Application"
                description="Complete your loan application in simple steps"
              />
            ) : (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-8 text-center">
                  <p className="text-red-600">Loan application form is currently unavailable.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </MobileLayout>
      </div>
    </>
  )
}
