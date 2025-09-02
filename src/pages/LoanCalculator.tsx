"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface LoanDetails {
  amount: number;
  interestRate: number;
  term: number;
  extraPayment: number;
}

interface PaymentDetails {
  month: number;
  principal: number;
  interest: number;
  balance: number;
}

const calculateLoan = ({
  amount,
  interestRate,
  term,
  extraPayment,
}: LoanDetails): {
  monthlyPayment: number;
  totalInterest: number;
  totalPaid: number;
  schedule: PaymentDetails[];
} => {
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = term * 12;

  // Calculate monthly payment using the loan amortization formula
  const monthlyPayment =
    (amount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  let balance = amount;
  let totalInterest = 0;
  const schedule: PaymentDetails[] = [];

  for (let month = 1; month <= numPayments && balance > 0; month++) {
    const interest = balance * monthlyRate;
    let principal = monthlyPayment + extraPayment - interest;

    if (principal > balance) {
      principal = balance;
    }

    balance -= principal;
    totalInterest += interest;

    schedule.push({
      month,
      principal: Number(principal.toFixed(2)),
      interest: Number(interest.toFixed(2)),
      balance: Number(balance.toFixed(2)),
    });

    if (balance <= 0) break;
  }

  return {
    monthlyPayment: Number(monthlyPayment.toFixed(2)),
    totalInterest: Number(totalInterest.toFixed(2)),
    totalPaid: Number((amount + totalInterest).toFixed(2)),
    schedule,
  };
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  }).format(value);
};

export default function LoanCalculator() {
  const [loanDetails, setLoanDetails] = useState<LoanDetails>({
    amount: 1000000,
    interestRate: 5,
    term: 3,
    extraPayment: 0,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { monthlyPayment, totalInterest, totalPaid, schedule } =
    calculateLoan(loanDetails);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);

    // Validation
    const newErrors = { ...errors };
    if (name === "amount" && (numValue < 1000 || numValue > 10000000)) {
      newErrors.amount = "Loan amount must be between ₹1,000 and ₹10,000,000";
    } else if (name === "interestRate" && (numValue < 0.1 || numValue > 30)) {
      newErrors.interestRate = "Interest rate must be between 0.1% and 30%";
    } else if (name === "term" && (numValue < 1 || numValue > 50)) {
      newErrors.term = "Loan term must be between 1 and 50 years";
    } else if (name === "extraPayment" && numValue < 0) {
      newErrors.extraPayment = "Extra payment cannot be negative";
    } else {
      delete newErrors[name];
    }

    setErrors(newErrors);

    setLoanDetails((prev) => ({
      ...prev,
      [name]: value === "" ? 0 : numValue,
    }));
  };

  const chartData = schedule.map((item) => ({
    month: item.month,
    principal: item.principal,
    interest: item.interest,
    balance: item.balance,
  }));

  return (
    <div className="min-h-screen bg-[#EBECED] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <a href="/" className="inline-flex items-center gap-2 text-blue-900 hover:text-blue-800 font-medium transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-[#252C3D] mb-4">
              Loan Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[#252C3D] mb-1">
                  Loan Amount (₹)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={loanDetails.amount}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#D6B549] focus:border-transparent"
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                )}
              </div>

              <div>
                <label className="block text-[#252C3D] mb-1">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  name="interestRate"
                  step="0.1"
                  value={loanDetails.interestRate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#D6B549] focus:border-transparent"
                />
                {errors.interestRate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.interestRate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[#252C3D] mb-1">
                  Loan Term (Years)
                </label>
                <input
                  type="number"
                  name="term"
                  value={loanDetails.term}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#D6B549] focus:border-transparent"
                />
                {errors.term && (
                  <p className="text-red-500 text-sm mt-1">{errors.term}</p>
                )}
              </div>

              <div>
                <label className="block text-[#252C3D] mb-1">
                  Extra Monthly Payment (₹)
                </label>
                <input
                  type="number"
                  name="extraPayment"
                  value={loanDetails.extraPayment}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#D6B549] focus:border-transparent"
                />
                {errors.extraPayment && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.extraPayment}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white p-6 rounded-lg shadow-lg border border-[#D6B549]/20">
            <h2 className="text-2xl font-bold text-[#252C3D] mb-6">
              Loan Summary
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-[#EBECED] p-4 rounded-md">
                <p className="text-sm text-[#252C3D] uppercase tracking-wide">
                  Monthly Payment
                </p>
                <p className="text-2xl font-semibold text-[#D6B549]">
                  {formatCurrency(monthlyPayment)}
                </p>
              </div>
              <div className="bg-[#EBECED] p-4 rounded-md">
                <p className="text-sm text-[#252C3D] uppercase tracking-wide">
                  Total Interest
                </p>
                <p className="text-2xl font-semibold text-[#D6B549]">
                  {formatCurrency(totalInterest)}
                </p>
              </div>
              <div className="bg-[#EBECED] p-4 rounded-md">
                <p className="text-sm text-[#252C3D] uppercase tracking-wide">
                  Total Paid
                </p>
                <p className="text-2xl font-semibold text-[#D6B549]">
                  {formatCurrency(totalPaid)}
                </p>
              </div>
              <div className="bg-[#EBECED] p-4 rounded-md">
                <p className="text-sm text-[#252C3D] uppercase tracking-wide">
                  Payoff Time
                </p>
                <p className="text-2xl font-semibold text-[#D6B549]">
                  {Math.ceil(schedule.length / 12)} years
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-[#252C3D] mb-4">
            Payment Breakdown
          </h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 60, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  label={{
                    value: "Month",
                    position: "insideBottom",
                    offset: -20,
                  }}
                  tickMargin={10}
                  interval="preserveStartEnd"
                  tickFormatter={(value) => (value % 12 === 0 ? value : "")}
                />
                <YAxis
                  label={{
                    value: "Amount (₹)",
                    angle: -90,
                    position: "insideLeft",
                    offset: -40,
                  }}
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "INR",
                      notation: "compact",
                    }).format(value)
                  }
                  tickMargin={10}
                />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend verticalAlign="top" height={36} />
                <Line
                  type="monotone"
                  dataKey="principal"
                  stroke="#D6B549"
                  name="Principal"
                />
                <Line
                  type="monotone"
                  dataKey="interest"
                  stroke="#252C3D"
                  name="Interest"
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#888888"
                  name="Balance"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Amortization Schedule */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md overflow-x-auto max-h-screen overflow-y-scroll">
          <h2 className="text-xl font-semibold text-[#252C3D] mb-4">
            Amortization Schedule
          </h2>
          <table className="w-full text-[#252C3D]">
            <thead>
              <tr className="bg-[#252C3D] text-white">
                <th className="p-2">Month</th>
                <th className="p-2">Principal</th>
                <th className="p-2">Interest</th>
                <th className="p-2">Balance</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((payment) => (
                <tr key={payment.month} className="border-b">
                  <td className="p-2 text-center">{payment.month}</td>
                  <td className="p-2 text-center">
                    {formatCurrency(payment.principal)}
                  </td>
                  <td className="p-2 text-center">
                    {formatCurrency(payment.interest)}
                  </td>
                  <td className="p-2 text-center">
                    {formatCurrency(payment.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
