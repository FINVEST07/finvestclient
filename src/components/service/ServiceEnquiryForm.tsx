import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Phone, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  ENQUIRY_SERVICE_OPTIONS,
  inferEnquiryServiceFromContext,
} from "@/lib/serviceOptions";

const ServiceEnquiryForm = () => {
  const { slug } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    city: "",
    service: "",
    amount: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (slug) {
      const inferred = inferEnquiryServiceFromContext(slug);
      if (inferred) {
        setFormData((prev) => ({ ...prev, service: inferred }));
      } else if (slug.includes("loan")) {
        setFormData((prev) => ({ ...prev, service: "loan" }));
      } else if (slug.includes("insurance")) {
        setFormData((prev) => ({ ...prev, service: "insurance" }));
      } else if (slug.includes("mutual-fund") || slug.includes("fixed-deposit") || slug.includes("bond")) {
        setFormData((prev) => ({ ...prev, service: "mutual_fund" }));
      }
    }
  }, [slug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.mobile || !formData.service) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post(`${import.meta.env.VITE_API_URI}sendenquiry`, formData);
      if (response.data?.status || response.data?.saved) {
        toast.success("Enquiry submitted successfully!");
        setFormData({
          name: "",
          email: "",
          mobile: "",
          city: "",
          service: formData.service,
          amount: "",
        });
      } else {
        toast.error(response.data?.message || "Something went wrong.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit enquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="lg:col-span-4">
      {/* Enquiry Form Card */}
      <div className="bg-white rounded-3xl shadow-2xl shadow-blue-900/10 border-2 border-blue-200 overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Enquire Now</h3>
            <p className="text-gray-500 mt-1">Get an expert consultation today</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-sm font-semibold text-gray-700">Mobile Number</Label>
              <Input
                id="mobile"
                value={formData.mobile}
                onChange={handleChange}
                maxLength={10}
                placeholder="10-digit mobile"
                className="rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service" className="text-sm font-semibold text-gray-700">Service Interested In</Label>
              <select
                id="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full h-11 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="" disabled>Select a service</option>
                {ENQUIRY_SERVICE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-semibold text-gray-700">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-semibold text-gray-700">Amount</Label>
                <Input
                  id="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="₹ Amount"
                  className="rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-11"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl h-12 text-lg font-bold shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5"
            >
              {submitting ? "Sending..." : "Request Consultation"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceEnquiryForm;
