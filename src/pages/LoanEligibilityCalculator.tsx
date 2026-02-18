"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";

type FormState = {
  income: string;
  foir: string;
  existingEmi: string;
  tenureYears: string;
  interestRate: string;
};

export default function LoanEligibilityCalculator() {
  const [form, setForm] = useState<FormState>({
    income: "",
    foir: "70",
    existingEmi: "",
    tenureYears: "",
    interestRate: "8",
  });

  const [error, setError] = useState<string>("");
  const [eligibleLakhs, setEligibleLakhs] = useState<number | null>(null);

  const parsed = useMemo(() => {
    const income = Number(form.income);
    const foir = Number(form.foir);
    const existingEmi = Number(form.existingEmi);
    const tenureYears = Number(form.tenureYears);
    const interestRate = Number(form.interestRate);

    return { income, foir, existingEmi, tenureYears, interestRate };
  }, [form]);

  const emiPerLakh = useMemo(() => {
    const tenureYears = Number(form.tenureYears);
    const interestRate = Number(form.interestRate);

    if (!Number.isFinite(tenureYears) || tenureYears <= 0) return null;
    if (!Number.isFinite(interestRate) || interestRate <= 0) return null;

    const amount = 100000; // 1 Lakh
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = tenureYears * 12;

    const monthlyPayment =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);

    if (!Number.isFinite(monthlyPayment) || monthlyPayment <= 0) return null;
    return Number(monthlyPayment.toFixed(2));
  }, [form.interestRate, form.tenureYears]);

  useEffect(() => {
    const { income, foir, existingEmi, tenureYears } = parsed;

    if (
      !form.income ||
      !form.foir ||
      !form.existingEmi ||
      !form.tenureYears ||
      !form.interestRate
    ) {
      setEligibleLakhs(null);
      setError("Please fill all fields.");
      return;
    }

    if (
      !Number.isFinite(income) ||
      !Number.isFinite(foir) ||
      !Number.isFinite(existingEmi) ||
      !Number.isFinite(tenureYears)
    ) {
      setEligibleLakhs(null);
      setError("Please enter valid numbers.");
      return;
    }

    if (income <= 0 || existingEmi < 0 || tenureYears <= 0) {
      setEligibleLakhs(null);
      setError("Values must be greater than 0 (Existing EMI can be 0).");
      return;
    }

    if (emiPerLakh == null) {
      setEligibleLakhs(null);
      setError("Please enter valid tenure and interest rate.");
      return;
    }

    if (foir < 40 || foir > 70) {
      setEligibleLakhs(null);
      setError("FOIR must be between 40 and 70.");
      return;
    }

    const eligible = (income * (foir / 100) - existingEmi) / emiPerLakh;

    if (!Number.isFinite(eligible) || eligible <= 0) {
      setEligibleLakhs(null);
      setError("Not eligible based on entered values.");
      return;
    }

    setError("");
    setEligibleLakhs(Number(eligible.toFixed(2)));
  }, [form, parsed]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const formatEligibleAmount = (lakhs: number) => {
    if (!Number.isFinite(lakhs)) return "-";

    if (lakhs >= 100) {
      const crores = lakhs / 100;
      const formatted = Number(crores.toFixed(2)).toString();
      return `${formatted} Crore`;
    }

    return `${Number(lakhs.toFixed(2)).toString()} Lakhs`;
  };

  return (
    <div className="min-h-screen bg-[#EBECED] p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-blue-900 hover:text-blue-800 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </a>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-blue-100/50 overflow-hidden">
          <div className="px-6 py-5 border-b border-blue-100/50">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-900">
              Loan Eligibility Calculator
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            <div className="lg:col-span-2 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-1">
                    Monthly Income
                  </label>
                  <input
                    name="income"
                    value={form.income}
                    onChange={handleChange}
                    inputMode="numeric"
                    className="w-full border border-blue-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                    placeholder="e.g. 100000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-1">
                    FOIR % (40–70)
                  </label>
                  <input
                    name="foir"
                    value={form.foir}
                    onChange={handleChange}
                    inputMode="numeric"
                    className="w-full border border-blue-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                    placeholder="e.g. 70"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-1">
                    Existing EMI
                  </label>
                  <input
                    name="existingEmi"
                    value={form.existingEmi}
                    onChange={handleChange}
                    inputMode="numeric"
                    className="w-full border border-blue-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                    placeholder="e.g. 5000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-1">
                    Tenure (years)
                  </label>
                  <input
                    name="tenureYears"
                    value={form.tenureYears}
                    onChange={handleChange}
                    inputMode="numeric"
                    className="w-full border border-blue-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                    placeholder="e.g. 20"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-blue-900 mb-1">
                    Rate of Interest (%)
                  </label>
                  <input
                    name="interestRate"
                    value={form.interestRate}
                    onChange={handleChange}
                    inputMode="numeric"
                    className="w-full border border-blue-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                    placeholder="e.g. 8"
                  />
                  {/* <p className="text-xs text-gray-500 mt-1">
                    EMI per Lakh (auto): {emiPerLakh != null ? `₹${emiPerLakh.toFixed(2)}` : "-"}
                  </p> */}
                </div>
              </div>

              {error && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>

            <div className="lg:col-span-1 p-6 bg-gradient-to-br from-white to-blue-50/30 border-t lg:border-t-0 lg:border-l border-blue-100/50">
              <h2 className="text-lg font-bold text-blue-900">
                Your Eligibility
              </h2>

              <div className="mt-4 rounded-2xl bg-white border border-blue-100/60 p-5 shadow-sm">
                <p className="text-sm text-gray-600">Eligible Loan</p>
                <p className="text-3xl font-extrabold text-blue-900 mt-1">
                  {eligibleLakhs != null ? formatEligibleAmount(eligibleLakhs) : "-"}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Result is shown in Lakhs with 2 decimals.
                </p>
              </div>

              {/* <a
                href="/services"
                className="mt-5 inline-flex w-full justify-center rounded-xl bg-blue-900 text-white py-3 font-semibold hover:bg-blue-800 transition"
              >
                Apply Now
              </a> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
