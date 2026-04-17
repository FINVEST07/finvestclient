"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MailIcon, PhoneIcon, MapPin, Clock, ArrowLeft } from "lucide-react";
import { Helmet } from 'react-helmet-async';
import { toast } from "sonner";
import Cookie from "js-cookie";
import {
  ENQUIRY_SERVICE_OPTIONS,
  normalizeEnquiryService,
} from "@/lib/serviceOptions";

const Refer = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    service: "",
    message: "",
    refercode: "",
  });

  const emailcookie = Cookie.get("finvest");

  const [responsetext, setResponsetext] = useState("");

  useEffect(() => {
    if (responsetext) {
      const timer = setTimeout(() => {
        setResponsetext("");
      }, 3000); // Clear responsetext after 3 seconds
      return () => clearTimeout(timer); // Cleanup on unmount or responsetext change
    }
  }, [responsetext]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    if (id === "service") {
      setFormData((prev) => ({ ...prev, service: normalizeEnquiryService(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URI}sendenquiry`,
        formData
      );
      const responseData = response.data || {};
      const enquirySaved = Boolean(responseData.status || responseData.saved);

      if (!enquirySaved) {
        toast.error(responseData.message || "Something Went Wrong");
        return;
      }

      const adminWhatsappSent = responseData.notifications?.adminWhatsapp === true;
      if (!adminWhatsappSent) {
        toast.error(
          responseData.message ||
            "Enquiry was saved, but client WhatsApp delivery failed. Please try again."
        );
        return;
      }

      toast.success(responseData.message || "Enquiry submitted successfully.");

      setResponsetext("Thank you for Enquiry😊");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        service: "",
        message: "",
        city: "",
        refercode: "",
      });
      
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Something Went Wrong");
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  return (
    <section id="contact" className="section-padding pt-6 bg-white">
      <Helmet>
        <title>Contact RISEHIGH FINCON - Financial Advice Inquiry</title>
        <meta
          name="description"
          content="Contact RISEHIGH FINCON for personalized financial advice. Submit an inquiry or call our advisors for loans, insurance, and investment solutions."
        />
      </Helmet>
      <div className="container-custom">
        <div className="mb-6">
          <a href="/" className="inline-flex items-center gap-2 text-blue-900 hover:text-blue-800 font-medium transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </a>
        </div>
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <span className="text-sm font-medium text-blue-900 bg-blue-200 py-1 px-3 rounded-full">
            Contact Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6 font-playfair text-blue-900">
            Get Personalized Financial Advice
          </h2>
          <p className="text-finance-slate text-lg">
            Schedule a consultation with our financial advisors to discuss your
            investment goals and loan options.
          </p>
        </div>

        {/* Form & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <Card className="p-6 lg:col-span-3 animate-fade-in-left">
            <form onSubmit={handleSubmit}>
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              {/* Contact Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Service Field */}
              <div className="space-y-2 mb-6">
                <Label htmlFor="service">Service Interested In</Label>
                <select
                  id="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {ENQUIRY_SERVICE_OPTIONS.map((serviceOption) => (
                    <option key={serviceOption.value} value={serviceOption.value}>
                      {serviceOption.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    id="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Referral Code</Label>
                  <Input
                    id="refercode"
                    required
                    value={formData.refercode}
                    onChange={handleChange}
                    placeholder="Enter your Employee / Partner ID"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2 mt-6 mb-6">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell us about your financial goals and how we can help"
                  cols={3}
                />
              </div>

              {responsetext && (
                <p className="text-center text-base md:text-xl xl:text-2xl my-1">
                  {responsetext}
                </p>
              )}

              {/* Button */}
              <Button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-900/ collages9 0 text-white"
              >
                Submit Inquiry
              </Button>
            </form>
          </Card>

          {/* Contact Info Cards */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in-right">
            <Card className="px-6 lg:py-10">
              <h3 className="text-xl font-playfair font-semibold mb-4 text-blue-900">
                Contact Information
              </h3>
              <div className="space-y-4 lg:space-y-6">
                <ContactInfo
                  icon={<MailIcon className="h-5 w-5 text-blue-900" />}
                  title="Email Us"
                  text="officefinvestcorp@gmail.com"
                  link="mailto:officefinvestcorp@gmail.com"
                />
                <ContactInfo
                  icon={<PhoneIcon className="h-5 w-5 text-blue-900" />}
                  title="Call Us"
                  text="+91 9324592709 / +91 9892204806"
                />
                <ContactInfo
                  icon={<MapPin className="h-5 w-5 text-blue-900" />}
                  title="Office Address"
                  text="Andheri West, Mumbai - 400058"
                />
                <ContactInfo
                  icon={<Clock className="h-5 w-5 text-blue-900" />}
                  title="Office Hours"
                  text="Monday - Saturday : 10AM - 7PM"
                />
              </div>
            </Card>

            <Card className="p-6 bg-blue-900 text-white">
              <p className="mb-4 text-white/80">
                Prefer to talk over the phone? Schedule a call with one of our
                advisors at your convenience.
              </p>
              <Button className="w-full bg-white text-blue-900 hover:bg-finance-cream">
                <a className="flex gap-2" href="tel:+9324592709">
                  <PhoneIcon /> Call Us
                </a>
              </Button>
            </Card>
          </div>
        </div>

        {/* Refer & Earn Content */}
        <Card className="p-6 md:p-8 mb-10 border-blue-100 bg-blue-50/40 animate-fade-in mt-10">
          <h2 className="text-2xl md:text-3xl font-playfair font-bold text-blue-900 mb-4">
            Refer & Earn with FinvestCorp
          </h2>
          <p className="text-finance-slate leading-relaxed mb-6">
            Join FinvestCorp&apos;s Refer & Earn program and unlock exciting rewards by simply sharing opportunities with your network. We believe in growing together, and your referrals help expand a trusted financial ecosystem.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">
                Benefits of Becoming Our Partner
              </h3>
              <ul className="list-disc list-inside space-y-2 text-finance-slate">
                <li>Earn attractive rewards for every successful referral</li>
                <li>Build a passive income stream effortlessly</li>
                <li>Strengthen your network with valuable financial solutions</li>
                <li>Get exclusive access to partner-only offers and insights</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">How It Works</h3>
              <ul className="list-disc list-inside space-y-2 text-finance-slate">
                <li>Refer friends, family, or colleagues to FinvestCorp</li>
                <li>
                  Once they successfully register or complete eligible actions,
                  you earn rewards
                </li>
                <li>The more you refer, the more you earn</li>
              </ul>
            </div>
          </div>

          <p className="text-finance-slate leading-relaxed mt-6">
            Every time you refer someone to FinvestCorp and they engage with our
            services, you receive exclusive benefits and rewards as a token of
            appreciation.
          </p>

          <p className="mt-4 font-semibold text-blue-900 text-lg">
            Start referring today and grow with FinvestCorp!
          </p>
        </Card>
      </div>
    </section>
  );
};

const ContactInfo = ({
  icon,
  title,
  text,
  link,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  link?: string;
}) => (
  <div className="flex items-start">
    <div className="mr-3 mt-1 bg-blue-900/5 p-2 rounded-full">{icon}</div>
    <div>
      <p className="font-medium text-blue-900">{title}</p>
      {link ? (
        <a
          href={link}
          className="text-finance-slate hover:text-finance-gold transition-colors whitespace-pre-line"
        >
          {text}
        </a>
      ) : (
        <p className="text-finance-slate whitespace-pre-line">{text}</p>
      )}
    </div>
  </div>
);

export default Refer;