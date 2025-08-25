"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator } from "lucide-react"

export function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState("25000")
  const [interestRate, setInterestRate] = useState("6.5")
  const [loanTerm, setLoanTerm] = useState("60")

  const calculateMonthlyPayment = () => {
    const principal = Number.parseFloat(loanAmount)
    const monthlyRate = Number.parseFloat(interestRate) / 100 / 12
    const numberOfPayments = Number.parseInt(loanTerm)

    if (principal && monthlyRate && numberOfPayments) {
      const monthlyPayment =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

      return monthlyPayment.toFixed(2)
    }
    return "0.00"
  }

  const totalInterest = () => {
    const monthlyPayment = Number.parseFloat(calculateMonthlyPayment())
    const principal = Number.parseFloat(loanAmount)
    const totalPaid = monthlyPayment * Number.parseInt(loanTerm)
    return (totalPaid - principal).toFixed(2)
  }

  return (
    <Card className="border-0 shadow-lg sticky top-24">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <Calculator className="w-5 h-5 text-green-600" />
          Loan Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="loan-amount">Loan Amount</Label>
          <Input
            id="loan-amount"
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            className="border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="interest-rate">Interest Rate (%)</Label>
          <Input
            id="interest-rate"
            type="number"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="loan-term">Loan Term</Label>
          <Select value={loanTerm} onValueChange={setLoanTerm}>
            <SelectTrigger className="border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">1 year (12 months)</SelectItem>
              <SelectItem value="24">2 years (24 months)</SelectItem>
              <SelectItem value="36">3 years (36 months)</SelectItem>
              <SelectItem value="48">4 years (48 months)</SelectItem>
              <SelectItem value="60">5 years (60 months)</SelectItem>
              <SelectItem value="72">6 years (72 months)</SelectItem>
              <SelectItem value="84">7 years (84 months)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Monthly Payment:</span>
              <span className="text-lg font-bold text-green-600">${calculateMonthlyPayment()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Interest:</span>
              <span className="text-sm font-medium text-gray-900">${totalInterest()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Amount:</span>
              <span className="text-sm font-medium text-gray-900">
                ${(Number.parseFloat(loanAmount) + Number.parseFloat(totalInterest())).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 text-center">
          <p className="text-xs text-gray-500">
            * This is an estimate. Actual rates and terms may vary based on creditworthiness and other factors.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
