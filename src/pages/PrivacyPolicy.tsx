import { Helmet } from "react-helmet-async";
import { ArrowLeft, Shield, FileText, Lock, Users, Mail, Eye, RefreshCw, Baby, Send, CreditCard, Building2 } from "lucide-react";

const sections = [
  {
    icon: FileText,
    title: "1. Introduction",
    body: (
      <p className="text-slate-600 leading-relaxed">
        FINVESTCORP (operated by RISEHIGH FINCON CONSULTANCY PVT. LTD), referred to as ("we", "us", or "our"), is a financial advisory firm based in Andheri West, Mumbai, offering personalized loan solutions, insurance advisory, investment opportunities, and an Investor Zone for property listings (Auction, Alternate Investment, New, and Resale properties). This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you use our website and services. By accessing or using our website, you consent to the practices described in this policy.
      </p>
    ),
  },
  {
    icon: Eye,
    title: "2. Information We Collect",
    body: (
      <>
        <p className="text-slate-600 leading-relaxed mb-4">We collect the following categories of information:</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: "Account Information", desc: "When you register, we collect your name, email address, mobile number, and password." },
            { label: "Contact & Enquiry Data", desc: "When you submit an enquiry or referral, we collect your name, email, mobile, city, service of interest, required amount, referral code, and message." },
            { label: "Application Details", desc: "When you apply for a service, we collect your email, mobile, alternate mobile, city, current and permanent addresses, residence type, qualification, profession, employment type, business details, financial information (purchase cost, existing loans, savings, loan amount required), insurance plan, sum insured, investment type and amount." },
            { label: "KYC & Documents", desc: "As part of your application, you may upload documents including your photo, PAN card, Aadhaar card, passport, visa, CDC, rent agreement, salary slip, bank statement, Form 16, ITR, sale agreement, share certificate, utility bills, NOC, and certificates. These are stored securely with our cloud storage provider." },
            { label: "Property & Favourites", desc: "We track properties you favourite or enquire about in the Investor Zone, including your viewing activity and filter preferences." },
            { label: "Payment Information", desc: "When you purchase a Premium subscription, we process payments through Razorpay. We store your subscription plan, order ID, payment ID, activation date, and expiry date. We do not store your card or banking credentials." },
            { label: "Usage Data", desc: "IP address, browser type, device information, pages visited, and time spent on pages." },
            { label: "Cookies", desc: "A session cookie is stored on your device to keep you logged in. See our Cookie Policy for details." },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
              <p className="font-semibold text-slate-800 text-sm mb-1">{item.label}</p>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    icon: Send,
    title: "3. How We Use Your Information",
    body: (
      <ul className="space-y-2.5 text-slate-600">
        {[
          "To register your account and authenticate your login using OTP or password.",
          "To process your loan, insurance, and investment applications and forward them to our partner banks, insurers, and financial institutions.",
          "To respond to your enquiries and provide customer support via email and WhatsApp.",
          "To send you service-related notifications, application status updates, and invoice emails for premium subscriptions.",
          "To enable Investor Zone features such as property favourites, premium filters, and property detail access.",
          "To send you updates, newsletters, and promotional materials (you may opt out at any time).",
          "To improve our website, services, and user experience.",
          "To comply with legal and regulatory obligations and protect against fraudulent activity.",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    icon: Users,
    title: "4. Sharing Your Information",
    body: (
      <>
        <p className="text-slate-600 leading-relaxed mb-4">
          We do not sell, trade, or rent your personal information to third parties. We share your information only in the following circumstances:
        </p>
        <div className="space-y-3">
          {[
            { label: "Partner Banks & Financial Institutions", desc: "When you apply for a loan, insurance, or investment, your application details and KYC documents are shared with the relevant partner bank or institution (e.g., SBI, HDFC, ICICI, Axis, LIC, Bajaj Allianz) to process your application." },
            { label: "Razorpay (Payment Gateway)", desc: "When you purchase a Premium subscription, payment details are processed by Razorpay. Razorpay handles your card/UPI/banking information securely. We receive only the order ID, payment ID, and signature for verification." },
            { label: "Cloudinary (Cloud Storage)", desc: "Your uploaded KYC documents and property images are stored on Cloudinary's secure cloud infrastructure." },
            { label: "Resend (Email Service)", desc: "We use Resend to deliver OTP emails, enquiry confirmations, application notifications, and premium subscription invoices to you and our admin team." },
            { label: "WhatsApp Notifications", desc: "We send enquiry confirmations and updates to your registered mobile number via WhatsApp, and notify our admin team of new enquiries." },
            { label: "Legal Authorities", desc: "When required by law, court order, or to protect our rights, property, or safety." },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
              <span className="mt-0.5 h-2 w-2 rounded-full bg-amber-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-800 text-sm">{item.label}</p>
                <p className="text-slate-500 text-sm leading-relaxed mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    icon: Lock,
    title: "5. Data Security",
    body: (
      <>
        <p className="text-slate-600 leading-relaxed mb-4">
          We implement appropriate technical and organizational measures to protect your personal information:
        </p>
        <ul className="space-y-2.5 text-slate-600">
          {[
            "All data transmission is encrypted using SSL/TLS (HTTPS).",
            "Passwords are stored in our database and never shared in plain text.",
            "OTP-based authentication with 2-minute expiry for registration and login.",
            "KYC documents are uploaded via validated, type-checked endpoints and stored on Cloudinary's secure cloud.",
            "Payment processing is handled entirely by Razorpay, a PCI-DSS compliant payment gateway.",
            "Access to user data is restricted to authorized administrative personnel only.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-slate-600 leading-relaxed mt-4">
          However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
        </p>
      </>
    ),
  },
  {
    icon: Shield,
    title: "6. Your Rights",
    body: (
      <>
        <p className="text-slate-600 leading-relaxed mb-4">You have the following rights regarding your personal data:</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: "Access", desc: "Request a copy of the personal information we hold about you." },
            { label: "Correction", desc: "Request that we correct any inaccurate or incomplete information." },
            { label: "Deletion", desc: "Request that we delete your personal information, subject to legal and regulatory obligations." },
            { label: "Opt-out", desc: "Unsubscribe from marketing communications and WhatsApp notifications at any time." },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
              <p className="font-semibold text-blue-900 text-sm mb-1">{item.label}</p>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-600 leading-relaxed mt-4">
          To exercise any of these rights, please contact us at{" "}
          <a href="mailto:officefinvestcorp@gmail.com" className="text-blue-700 font-medium hover:underline">
            officefinvestcorp@gmail.com
          </a>
          .
        </p>
      </>
    ),
  },
  {
    icon: CreditCard,
    title: "7. Premium Subscription Data",
    body: (
      <p className="text-slate-600 leading-relaxed">
        When you subscribe to our Premium plans (1 Month, 3 Months, 6 Months, or 1 Year), we collect and store your subscription plan, payment amount, Razorpay order ID, payment ID, activation date, and expiry date. An invoice email is sent to your registered email address. We do not store your credit/debit card numbers, UPI IDs, or net banking credentials — all payment information is handled securely by Razorpay.
      </p>
    ),
  },
  {
    icon: Building2,
    title: "8. Investor Zone Data",
    body: (
      <p className="text-slate-600 leading-relaxed">
        When you use the Investor Zone, we track which properties you favourite and your filter preferences. Property listings include details such as property type, location, price, auction dates, EMD/EOI dates, inspection dates, and contact information provided by property posters. Premium users gain access to additional features such as the Inspection Date filter. Non-premium users can still browse and favourite properties.
      </p>
    ),
  },
  {
    icon: Baby,
    title: "9. Children's Privacy",
    body: (
      <p className="text-slate-600 leading-relaxed">
        Our website and financial services are intended for individuals aged 18 and above. We do not knowingly collect personal information from minors. If you believe we have collected information from a minor, please contact us so we can remove it.
      </p>
    ),
  },
  {
    icon: RefreshCw,
    title: "10. Changes to This Policy",
    body: (
      <p className="text-slate-600 leading-relaxed">
        We may update this Privacy Policy from time to time to reflect changes in our services, legal requirements, or practices. Any changes will be posted on this page with an updated revision date. We encourage you to review this page periodically.
      </p>
    ),
  },
  {
    icon: Mail,
    title: "11. Contact Us",
    body: (
      <div className="rounded-xl bg-gradient-to-br from-blue-900 to-blue-800 p-6 text-white">
        <p className="leading-relaxed text-white/90 mb-4">
          If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us at:
        </p>
        <div className="space-y-1.5 text-white/80 text-sm">
          <p className="font-semibold text-white">FINVESTCORP (RISEHIGH FINCON CONSULTANCY PVT. LTD)</p>
          <p>Andheri West, Mumbai - 400058</p>
          <p>
            Email:{" "}
            <a href="mailto:officefinvestcorp@gmail.com" className="text-amber-300 hover:underline">
              officefinvestcorp@gmail.com
            </a>
          </p>
          <p>
            Phone:{" "}
            <a href="tel:+919324592709" className="text-amber-300 hover:underline">
              +91 9324592709
            </a>
            {" / "}
            <a href="tel:+919892204806" className="text-amber-300 hover:underline">
              +91 9892204806
            </a>
          </p>
        </div>
      </div>
    ),
  },
];

const PrivacyPolicy = () => (
  <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
    <Helmet>
      <title>Privacy Policy - FINVESTCORP</title>
      <meta
        name="description"
        content="Read the FINVESTCORP Privacy Policy to understand how we collect, use, and protect your personal information across our financial advisory, loan, insurance, investment, and property listing services."
      />
    </Helmet>

    <div className="container-custom max-w-5xl py-12 px-4">
      <a
        href="/"
        className="inline-flex items-center gap-2 text-blue-900 hover:text-blue-700 font-medium transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </a>

      <div className="rounded-3xl bg-white shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-10 md:px-12 md:py-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
              <Shield className="h-6 w-6 text-amber-300" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Privacy Policy</h1>
          </div>
          <p className="text-white/60 text-sm">Last updated: July 2026</p>
        </div>

        <div className="px-8 py-10 md:px-12 md:py-12 space-y-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-blue-700" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-800">{section.title}</h2>
                </div>
                <div className="pl-12">{section.body}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

export default PrivacyPolicy;
