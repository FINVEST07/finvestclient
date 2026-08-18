import { Helmet } from "react-helmet-async";
import { ArrowLeft, Building2 } from "lucide-react";

const Finance = () => (
  <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
    <Helmet>
      <title>Construction Finance - FINVESTCORP</title>
      <meta
        name="description"
        content="Construction Finance solutions by FINVESTCORP. Coming soon."
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
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-12 md:px-12 md:py-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
              <Building2 className="h-7 w-7 text-amber-300" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Construction Finance
          </h1>
          <p className="text-white/70 text-lg">
            We're working on something exciting for you.
          </p>
        </div>

        <div className="px-8 py-12 md:px-12 md:py-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-2 mb-6">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-amber-700 text-sm font-medium">Coming Soon</span>
          </div>
          <p className="text-slate-600 leading-relaxed max-w-md mx-auto">
            Our Construction Finance page is under development. Please check back soon for more details about our construction loan and financing solutions.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 mt-8 bg-blue-900 text-white px-6 py-3 rounded-xl hover:bg-blue-800 transition"
          >
            Back to Home
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default Finance;
