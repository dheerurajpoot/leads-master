"use client"

import { useState } from "react"
import { MobileCard } from "@/components/mobile/mobile-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, DollarSign, Calendar, Percent } from "lucide-react"

export function MobileLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState("25000")
  const [interestRate, setInterestRate] = useState("6.5")
  const [loanTerm, setLoanTerm] = useState("60")
  const [showResults, setShowResults] = useState(false)

  const calculatePayment = () => {
    const principal = Number.parseFloat(loanAmount)
    const monthlyRate = Number.parseFloat(interestRate) / 100 / 12
    const numPayments = Number.parseInt(loanTerm)

    if (principal && monthlyRate && numPayments) {
      const monthlyPayment =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)

      const totalPayment = monthlyPayment * numPayments
      const totalInterest = totalPayment - principal

      return {
        monthlyPayment: monthlyPayment.toFixed(2),
        totalPayment: totalPayment.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
      }
    }
    return null
  }

  const results = calculatePayment()

  return (
    <MobileCard title="Loan Calculator" padding="sm">
      <div className="space-y-4">
        {/* Loan Amount */}
        <div className="space-y-2">
          <Label htmlFor="loanAmount" className="text-base font-medium">
            Loan Amount
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="loanAmount"
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="pl-10 mobile-input"
              placeholder="25000"
            />
          </div>
        </div>

        {/* Interest Rate */}
        <div className="space-y-2">
          <Label htmlFor="interestRate" className="text-base font-medium">
            Interest Rate (%)
          </Label>
          <div className="relative">
            <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="interestRate"
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="pl-10 mobile-input"
              placeholder="6.5"
            />
          </div>
        </div>

        {/* Loan Term */}
        <div className="space-y-2">
          <Label htmlFor="loanTerm" className="text-base font-medium">
            Loan Term
          </Label>
          <Select value={loanTerm} onValueChange={setLoanTerm}>
            <SelectTrigger className="mobile-input">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">1 Year (12 months)</SelectItem>
              <SelectItem value="24">2 Years (24 months)</SelectItem>
              <SelectItem value="36">3 Years (36 months)</SelectItem>
              <SelectItem value="48">4 Years (48 months)</SelectItem>
              <SelectItem value="60">5 Years (60 months)</SelectItem>
              <SelectItem value="72">6 Years (72 months)</SelectItem>
              <SelectItem value="84">7 Years (84 months)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Calculate Button */}
        <Button onClick={() => setShowResults(true)} className="mobile-button bg-green-600 hover:bg-green-700">
          <Calculator className="w-4 h-4 mr-2" />
          Calculate Payment
        </Button>

        {/* Results */}
        {showResults && results && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-3">Loan Calculation Results</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-green-700">Monthly Payment:</span>
                <span className="font-bold text-green-800">${results.monthlyPayment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Total Payment:</span>
                <span className="font-bold text-green-800">${results.totalPayment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Total Interest:</span>
                <span className="font-bold text-green-800">${results.totalInterest}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileCard>
  )
}
