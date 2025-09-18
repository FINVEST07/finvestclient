//@ts-nocheck
import React, { useState } from "react";
import Login from "@/components/Login";
import Cookie from "js-cookie";
import { CheckCircle, Users, Shield, Sparkles, Handshake, LineChart, ArrowLeft } from "lucide-react";

const Benefit = ({ icon: Icon, title, desc }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100 hover:shadow-md transition-all">
    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center mb-4">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-lg font-semibold text-blue-900 mb-2 font-playfair">{title}</h3>
    <p className="text-finance-slate leading-relaxed">{desc}</p>
  </div>
);

const Step = ({ number, title, desc }) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-semibold">
      {number}
    </div>
    <div>
      <h4 className="text-blue-900 font-semibold mb-1">{title}</h4>
      <p className="text-finance-slate">{desc}</p>
    </div>
  </div>
);

const BecomePartner = () => {
  const [loginopen, setLoginOpen] = useState(false);
  const cookie = Cookie.get("finvest");

  const handleJoinUs = () => {
    if (!cookie) {
      setLoginOpen(true);
      return;
    }
    // Logged in: do what current Become a Partner link does (navigate to dashboard)
    window.location.href = "/customerdashboard";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <main className="container-custom pt-10 pb-20">
        <div className="mb-6">
          <a href="/" className="inline-flex items-center gap-2 text-blue-900 hover:text-blue-800 font-medium transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </a>
        </div>
        {/* Header */}
        <section className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block text-sm font-medium text-blue-900 bg-blue-100 py-1 px-4 rounded-full">
            Partner with FinvestCorp
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mt-4 mb-4 font-playfair text-blue-900">
            Grow with us as a FinvestCorp Partner
          </h1>
          <p className="text-finance-slate text-lg">
            Join our nationwide network of partners and unlock new income opportunities
            with transparent processes, dedicated support, and trusted financial products.
          </p>
          <div className="mt-8">
            <button
              onClick={handleJoinUs}
              className="px-6 py-3 rounded-xl bg-blue-900 text-white hover:bg-blue-800 transition-colors shadow-md"
            >
              Join Us
            </button>
          </div>
        </section>

        {/* Benefits */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Benefit icon={Handshake} title="High Payouts" desc="Earn competitive commissions on loans, insurance, and investment products with timely settlements." />
          <Benefit icon={Users} title="Dedicated Support" desc="Access a relationship manager, training resources, and on-call assistance for smoother closures." />
          <Benefit icon={Shield} title="Trusted Products" desc="Offer clients curated options from leading banks, insurers, and AMCs—backed by our due diligence." />
          <Benefit icon={Sparkles} title="Marketing Enablement" desc="Ready-to-use creatives, co-branding options, and lead generation guidance to scale faster." />
          <Benefit icon={LineChart} title="CRM & Tracking" desc="Track leads, applications, and payouts with transparency through our streamlined workflows." />
          <Benefit icon={CheckCircle} title="Zero Joining Cost" desc="Start partnering at no upfront fee—grow with us and earn from day one." />
        </section>

        {/* How it works */}
        <section className="bg-white rounded-2xl p-8 border border-blue-100 shadow-sm mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 font-playfair mb-6">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Step number={1} title="Register/Login" desc="Create your partner account or login to get started in minutes." />
            <Step number={2} title="Share Leads" desc="Submit client details securely and let our experts do the heavy lifting." />
            <Step number={3} title="Earn Payouts" desc="Get paid on successful closures with complete transparency." />
          </div>
        </section>

        {/* Who can join */}
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 font-playfair mb-4">Who can join?</h2>
          <p className="text-finance-slate max-w-3xl">
            Financial advisors, real estate agents, chartered accountants, insurance agents,
            bankers, freelancers, and anyone with a client network interested in financial
            solutions. Whether you’re an individual or a company, we welcome you.
          </p>
        </section>

        {/* CTA */}
        <section className="text-center mt-10">
          <div className="inline-flex items-center gap-4 bg-blue-900 text-white rounded-2xl px-6 py-5 shadow-lg">
            <div>
              <div className="font-semibold text-lg">Ready to partner?</div>
              <div className="text-white/80 text-sm">Register or login to get started</div>
            </div>
            <button
              onClick={handleJoinUs}
              className="px-5 py-2 rounded-xl bg-white text-blue-900 hover:bg-blue-50 transition-colors"
            >
              Join Us
            </button>
          </div>
        </section>
      </main>
      <Login setLoginOpen={setLoginOpen} loginopen={loginopen} />
    </div>
  );
};

export default BecomePartner;
