import React, { useEffect, useRef, useState } from "react";
import Cookie from "js-cookie";
import axios from "axios";
import { z } from "zod";

const ENQUIRY_SUBMITTED_COOKIE = "finvest_enquiry_submitted";

type ServiceType = "loan" | "insurance" | "investment" | "";

const EnquiryModal = () => {
  const [open, setOpen] = useState(false);
  const reopenTimeoutRef = useRef<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    city: "",
    service: "" as ServiceType,
    amount: "",
    referralCode: "",
  });

  const hasSubmitted = () => Cookie.get(ENQUIRY_SUBMITTED_COOKIE) === "1";

  const clearReopenTimeout = () => {
    if (reopenTimeoutRef.current) {
      window.clearTimeout(reopenTimeoutRef.current);
      reopenTimeoutRef.current = null;
    }
  };

  const scheduleReopen = () => {
    clearReopenTimeout();

    reopenTimeoutRef.current = window.setTimeout(() => {
      if (!hasSubmitted()) {
        setOpen(true);
      }
    }, 20000);
  };

  useEffect(() => {
    if (!hasSubmitted()) {
      setOpen(true);
    }

    return () => {
      clearReopenTimeout();
    };
  }, []);

  const onClose = () => {
    setOpen(false);

    if (!hasSubmitted()) {
      scheduleReopen();
    }
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError("");
  };

  const enquirySchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email"),
    mobile: z
      .string()
      .transform((v) => v.replace(/\D/g, ""))
      .refine((v) => v.length === 10, "Mobile number must be 10 digits"),
    city: z.string().min(1, "City is required"),
    service: z.enum(["loan", "insurance", "investment"]),
    amount: z.string().min(1, "Amount is required"),
    referralCode: z.string().optional(),
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const parsedForm = enquirySchema.safeParse(formData);
      if (!parsedForm.success) {
        const firstIssue = parsedForm.error.issues[0];
        setValidationError(firstIssue?.message || "Please check your inputs.");
        return;
      }

      setSubmitting(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URI}sendenquiry`,
        {
          name: parsedForm.data.name,
          email: parsedForm.data.email,
          mobile: parsedForm.data.mobile,
          city: parsedForm.data.city,
          service: parsedForm.data.service,
          amount: parsedForm.data.amount,
          referralCode: parsedForm.data.referralCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.data?.status) {
        return;
      }

      Cookie.set(ENQUIRY_SUBMITTED_COOKIE, "1", { expires: 365 });
      clearReopenTimeout();
      setOpen(false);
    } catch (error) {
      console.error("Failed to submit enquiry:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-blue-100/50 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-blue-100/50 bg-white/95">
          <div>
            <h3 className="text-lg font-bold text-blue-900">Enquiry</h3>
            <p className="text-sm text-gray-600">Tell us what you’re looking for</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg hover:bg-blue-50 text-blue-900 text-sm"
          >
            Close
          </button>
        </div>

        <form noValidate onSubmit={onSubmit} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={onChange}
                className="w-full border border-blue-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                placeholder="Your name"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                className="w-full border border-blue-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                placeholder="you@example.com"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Mobile
              </label>
              <input
                name="mobile"
                value={formData.mobile}
                onChange={onChange}
                maxLength={10}
                inputMode="numeric"
                className="w-full border border-blue-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                placeholder="10-digit mobile"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                City
              </label>
              <input
                name="city"
                value={formData.city}
                onChange={onChange}
                className="w-full border border-blue-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                placeholder="Your city"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Select Service
              </label>
              <select
                name="service"
                value={formData.service}
                onChange={onChange}
                className="w-full border border-blue-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 bg-white"
              >
                <option value="">Select</option>
                <option value="loan">Loan</option>
                <option value="insurance">Insurance</option>
                <option value="investment">Investment</option>
              </select>
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Amount
              </label>
              <input
                name="amount"
                value={formData.amount}
                onChange={onChange}
                className="w-full border border-blue-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                placeholder="Requested amount"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Referral Code
              </label>
              <input
                name="referralCode"
                value={formData.referralCode}
                onChange={onChange}
                className="w-full border border-blue-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                placeholder="(Optional)"
              />
            </div>
          </div>

          {validationError && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {validationError}
            </div>
          )}

          <div className="mt-4 flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-blue-200 text-blue-900 hover:bg-blue-50 transition text-sm"
            >
              Not now
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 rounded-lg bg-blue-900 text-white hover:bg-blue-800 transition text-sm"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnquiryModal;
