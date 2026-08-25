import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Phone,
  Home,
  TrendingUp,
  Calculator,
  ChevronDown,
  ClipboardList,
  Percent,
  Clock,
  ShieldCheck,
  DollarSign,
  Layers,
  CheckCircle2,
  Hammer,
  FileText,
  HardHat,
  LandPlot,
  FileCheck,
  IndianRupee,
} from "lucide-react";
import { infos } from "@/data/serviceInfoData";
import ServiceEnquiryForm from "@/components/service/ServiceEnquiryForm";
import ServiceDirectContact from "@/components/service/ServiceDirectContact";

const info = infos["construction-finance"];

const TOKENS = {
  paper: "#F8FAFC",
  paperLine: "#E2E8F0",
  ink: "#1E3A5F",
  orange: "#D9531E",
  green: "#1F6F54",
  blue: "#2563EB",
};

const stats = [
  { icon: IndianRupee, value: "₹50L – ₹500Cr", label: "Loan Range" },
  { icon: Clock, value: "2–4 Weeks", label: "Sanction TAT" },
  { icon: Layers, value: "Up to 70%", label: "LTV Ratio" },
  { icon: Building2, value: "20+ Lenders", label: "Bank & NBFC Network" },
];

const loanTypes = [
  { icon: Home, name: "Residential Construction", ltc: "up to 70% LTC", rate: "9% – 13%", term: "2–5 years", bestFor: "Residential towers, gated communities, standalone housing" },
  { icon: Building2, name: "Commercial Construction", ltc: "60% – 65% LTC", rate: "10% – 14%", term: "3–7 years", bestFor: "Office complexes, IT parks, retail spaces" },
  { icon: TrendingUp, name: "Bridge / Mezzanine", ltc: "fills gap to 85% LTC", rate: "14% – 18%", term: "1–3 years, interest-only", bestFor: "Fast closings, value-add, stretching leverage" },
  { icon: LandPlot, name: "Land Acquisition Finance", ltc: "50% – 65% LTC", rate: "11% – 15%", term: "1–3 years", bestFor: "Land purchase with conversion to construction loans" },
  { icon: Hammer, name: "Redevelopment & SRA", ltc: "up to 70% LTC", rate: "10% – 14%", term: "3–5 years", bestFor: "Society redevelopment, slum rehabilitation projects" },
  { icon: HardHat, name: "Infrastructure & Industrial", ltc: "55% – 70% LTC", rate: "9% – 13%", term: "5–10 years", bestFor: "Industrial sheds, warehouses, infrastructure projects" },
];

const drawPhases = [
  { name: "Foundation", pct: 15, detail: "Excavation, footings, slab poured and inspected" },
  { name: "Structure & Roof", pct: 25, detail: "Columns, beams, slab casting, roofing dried-in" },
  { name: "MEP Rough-in", pct: 20, detail: "Plumbing, electrical, HVAC roughed in" },
  { name: "Finishing", pct: 20, detail: "Plaster, flooring, doors, windows, paint" },
  { name: "Substantial Completion", pct: 12, detail: "Cabinetry, fixtures, final paint, cleanup" },
  { name: "Final / Occupancy Certificate", pct: 8, detail: "Punch list cleared, OC issued" },
];

const ratios = [
  { label: "LTC", formula: "Loan ÷ total project cost", range: "50% – 70%", desc: "The primary sizing metric. Total cost includes land, hard costs, soft costs, interest reserve, and contingency." },
  { label: "LTV", formula: "Loan ÷ appraised value", range: "55% – 70%", desc: "Runs against as-completed or stabilized appraised value. Lenders size to the lower of LTC and LTV." },
  { label: "DSCR", formula: "Stabilized NOI ÷ debt service", range: "1.25x – 1.40x", desc: "Tested at takeout for income-producing projects. Construction loans with no in-place income are underwritten on projected NOI." },
];

const rateRows = [
  { lender: "Public Sector Bank", rate: "9% – 11%", leverage: "60–70% LTC", speed: "4–6 weeks" },
  { lender: "Private Bank", rate: "10% – 13%", leverage: "55–65% LTC", speed: "3–4 weeks" },
  { lender: "NBFC", rate: "11% – 14%", leverage: "up to 70% LTC", speed: "2–3 weeks" },
  { lender: "Debt Fund / AIF", rate: "14% – 18%", leverage: "up to 85% LTC", speed: "1–2 weeks" },
  { lender: "Mezzanine / Pref. Equity", rate: "16% – 22% + fees", leverage: "gap to 85% LTC", speed: "runs with senior close" },
];

const docsResidential: string[] = [
  "RERA registration and approved building plan",
  "Clear land title with 7/12 and property card",
  "Detailed project cost breakdown and specifications",
  "Contractor agreements and technical feasibility report",
  "Developer financials and track record",
  "Environmental clearance (if applicable)",
];

const docsCommercial: string[] = [
  "RERA registration and all statutory approvals",
  "Phase I environmental (Phase II if flagged)",
  "As-is and as-completed valuation reports",
  "Third-party market and absorption study",
  "Stabilized pro forma and rent roll assumptions",
  "Payment and performance bond on the GC",
  "Developer financials, ITR (3 years), and bank statements",
  "Projected cash flow with sales/lease assumptions",
];

const eligibility = [
  "Established builders, developers, and construction companies",
  "Projects with RERA registration and requisite local authority approvals",
  "Clear and marketable land title with no encumbrances",
  "Project cost viability with realistic sales or rental projections",
  "Developer track record with completed or ongoing projects",
  "Adequate promoter contribution and skin in the game",
];

const scenarios = [
  { title: "Residential Tower Project", desc: "A developer building a 15-floor residential tower secured ₹45 crore in construction finance with staged disbursal across 6 milestones, enabling simultaneous sales and construction." },
  { title: "Commercial Office Complex", desc: "An IT park developer accessed ₹80 crore structured finance with 60% LTV, leveraging pre-lease commitments to secure favorable terms and faster sanction." },
  { title: "Society Redevelopment", desc: "A redevelopment project with 120 flats obtained ₹30 crore construction finance including transit camp costs, with repayment linked to new flat sales proceeds." },
];

const faqs = [
  { q: "What is construction finance?", a: "Construction finance is a specialized loan product for builders and developers to fund real estate construction projects. It covers land acquisition, construction costs, and project expenses with staged disbursements linked to construction milestones." },
  { q: "Why do I only pay interest on the drawn amount?", a: "Construction debt is funded in stages, not as a lump sum at closing. Interest accrues only on the portion actually disbursed, so a ₹50 crore commitment with ₹12 crore drawn carries interest on ₹12 crore — the outstanding balance climbs as the building does." },
  { q: "What is an interest reserve?", a: "It's a line item inside the loan — typically 8–12% of the total amount — set aside to cover accruing interest during the build, since the property produces no income yet. It's capitalized into the loan rather than paid out of pocket." },
  { q: "How is the loan disbursed?", a: "Construction loans are disbursed in stages linked to project milestones — foundation, slab casting, brickwork, finishing, and occupancy certificate. Each draw is released after lender-approved technical verification." },
  { q: "What is the typical loan-to-value (LTV) ratio?", a: "LTV ratios generally range from 50% to 70% of the project cost, depending on the lender, project type, location, and developer profile. Higher LTV may be available for established developers with strong track records." },
  { q: "What happens if construction costs run over budget?", a: "Contingency reserves (usually 5–10% of hard costs) absorb routine overruns and are inspected the same as any other draw. Costs beyond contingency typically require a capital call from the sponsor, a loan modification, or added mezzanine financing." },
  { q: "Can a first-time developer get a construction loan?", a: "Yes, but expect tighter terms: a track-record requirement usually met by bringing on an experienced development partner, higher equity (often 35–40%+), and demonstrated liquidity and net worth." },
  { q: "What documents are required?", a: "Key documents include project approvals (RERA, building plan, environmental clearance), land title documents, developer financials, project cost breakdown, contractor agreements, and KYC documents." },
];

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
    <span style={{ width: 16, height: 1, background: TOKENS.blue, display: "inline-block" }} />
    {children}
  </div>
);

const SectionHeading: React.FC<{ eyebrow: string; title: string; sub?: string }> = ({ eyebrow, title, sub }) => (
  <div className="mb-5">
    <Eyebrow>{eyebrow}</Eyebrow>
    <h2 className="text-2xl md:text-[2rem] font-bold leading-tight text-gray-900">{title}</h2>
    {sub && <p className="mt-2 max-w-3xl text-sm md:text-base leading-relaxed text-gray-500">{sub}</p>}
  </div>
);

const Finance = () => {
  const [loanAmount, setLoanAmount] = useState<number>(50000000);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const canonicalUrl = typeof window !== "undefined" ? `${window.location.origin}/construction-finance` : "/construction-finance";

  const cumulative = useMemo(() => {
    let running = 0;
    return drawPhases.map((phase) => {
      running += phase.pct;
      return { ...phase, cumulativePct: running, amount: (loanAmount * phase.pct) / 100 };
    });
  }, [loanAmount]);

  const fmt = (n: number) =>
    "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  return (
    <section className="pt-6 pb-16 min-h-screen" style={{ background: TOKENS.paper }}>
      <style>{`
        .cf-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
        input[type="range"].cf-range { -webkit-appearance: none; height: 3px; background: ${TOKENS.paperLine}; border-radius: 2px; }
        input[type="range"].cf-range::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: ${TOKENS.blue}; cursor: pointer; margin-top: -5.5px; }
        input[type="range"].cf-range::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: ${TOKENS.blue}; border: none; cursor: pointer; }
      `}</style>
      <Helmet>
        <title>Construction Finance - FINVESTCORP</title>
        <meta name="description" content={info.description} />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">
          {JSON.stringify({ '@context': 'https://schema.org', '@type': 'Service', name: 'Construction Finance', description: info.description, provider: { '@type': 'Organization', name: 'FINVESTCORP' }, areaServed: 'IN', serviceType: 'Construction Finance' })}
        </script>
      </Helmet>

      <div className="container mx-auto px-6">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-900 hover:text-blue-800 font-medium transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-blue-900 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/services" className="hover:text-blue-900 transition-colors">Services</Link>
            <span>/</span>
            <span className="text-blue-900 font-medium">Construction Finance</span>
          </nav>
        

          {/* Hero */}
          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-5">
            <div className="md:col-span-3">
              <Eyebrow>Ground-up &amp; renovation lending</Eyebrow>
              <h1 className="text-3xl md:text-5xl font-bold leading-[1.1] text-gray-900 mb-3">
                Capital that releases<br />in step with the build.
              </h1>
              <p className="max-w-2xl text-sm md:text-lg leading-relaxed text-gray-600 mb-5">
                {info.description} Construction financing doesn't fund like a mortgage. Money is committed up front but disbursed in inspected stages, interest accrues only on what's drawn, and the loan is sized against a project that doesn't exist yet.
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="flex h-full flex-col justify-between rounded-xl border border-blue-200 bg-blue-50/50 p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-green-600" />
                    <span className="cf-mono text-xs uppercase tracking-wide text-gray-900">Core rule</span>
                  </div>
                  <p className="mt-2 text-sm md:text-base leading-relaxed text-gray-700">
                    You only pay interest on the outstanding balance drawn — not the full loan commitment. A ₹50 crore loan with ₹12 crore released so far accrues interest on ₹12 crore, keeping early-stage carrying costs low.
                  </p>
                </div>
                <p className="cf-mono mt-4 text-[11px] text-gray-400">Educational overview — not a rate quote or lending offer.</p>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl p-5 shadow-lg shadow-gray-100/50 border border-gray-100 text-center">
                <div className="w-11 h-11 mx-auto mb-3 rounded-xl bg-blue-100 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-blue-700" />
                </div>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              {/* Draw Schedule Ledger */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg shadow-gray-100/50 border border-gray-100">
                <SectionHeading eyebrow="Signature: the draw ledger" title="How a loan actually pays out" sub="Funds release against inspected milestones, not a calendar. Adjust the loan amount below to see how a typical six-phase draw schedule breaks down." />
                <div className="mb-4 flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <Calculator size={20} className="text-blue-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="cf-mono flex items-center justify-between text-xs font-bold text-gray-500">
                      <span>LOAN AMOUNT</span>
                      <span className="text-lg font-bold text-gray-900">{fmt(loanAmount)}</span>
                    </div>
                    <input type="range" className="cf-range mt-2 w-full" min={5000000} max={500000000} step={500000} value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} />
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute left-0 right-0 top-[22px] hidden h-px sm:block" style={{ background: TOKENS.paperLine }} />
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {cumulative.map((phase, i) => (
                      <div key={phase.name} className="relative flex flex-col">
                        <div className="z-10 mx-auto mb-2 hidden h-11 w-11 items-center justify-center rounded-full border-2 sm:flex" style={{ background: TOKENS.paper, borderColor: TOKENS.blue, color: TOKENS.ink }}>
                          <span className="cf-mono text-sm font-bold">{i + 1}</span>
                        </div>
                        <div className="flex-1 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                          <div className="text-sm font-bold text-gray-900 leading-tight">{phase.name}</div>
                          <div className="cf-mono mt-1 text-xs font-bold text-blue-600">{phase.pct}% draw</div>
                          <div className="mt-1 text-base font-bold text-gray-900">{fmt(phase.amount)}</div>
                          <div className="cf-mono mt-1 text-[11px] text-gray-400">cum. {phase.cumulativePct}%</div>
                          <p className="mt-2 text-xs font-medium leading-snug text-gray-500">{phase.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="cf-mono mt-3 text-[11px] text-gray-400">Illustrative schedule. Commercial projects often run 8–12 draws tied to a certified AIA-style pay application rather than fixed percentages.</p>
              </div>

              {/* Financial Structure: Interest Reserve & Capital Stack */}
              <div className="grid md:grid-cols-12 gap-6">
                <div className="md:col-span-5 bg-slate-50 rounded-2xl border border-gray-200 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center"><DollarSign size={20} className="text-green-700" /></div>
                      <span className="text-lg font-bold text-gray-900">Interest Reserve</span>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-bold text-gray-900 mb-1">Purpose</div>
                        <p className="text-sm leading-relaxed text-gray-600">A line item (8–12%) set aside to cover interest during the build since the property isn't producing income yet.</p>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 mb-1">Mechanism</div>
                        <p className="text-sm leading-relaxed text-gray-600">It's built into the loan and drawn automatically, so you don't write checks out of pocket.</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="text-xs font-bold text-red-600 uppercase tracking-wide mb-1">Key Risk</div>
                    <p className="text-xs font-medium text-gray-500">Reserves can run dry if rates rise or timelines slip, forcing a capital call.</p>
                  </div>
                </div>

                <div className="md:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"><Layers size={20} className="text-blue-700" /></div>
                    <span className="text-lg font-bold text-gray-900">Typical Capital Stack</span>
                  </div>
                  <div className="flex h-12 w-full overflow-hidden rounded-xl border border-gray-900 mb-6">
                    <div className="flex items-center justify-center text-xs font-bold text-white shadow-inner" style={{ width: "65%", background: TOKENS.ink }}>Senior Debt · 65%</div>
                    <div className="flex items-center justify-center text-xs font-bold text-white shadow-inner" style={{ width: "20%", background: TOKENS.orange }}>Mezz · 20%</div>
                    <div className="flex items-center justify-center text-xs font-bold text-white shadow-inner" style={{ width: "15%", background: TOKENS.green }}>Equity · 15%</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm font-bold text-gray-900 mb-1">Senior Debt</div>
                      <p className="text-xs font-medium text-gray-500 leading-relaxed">Bank or NBFC, first lien. Cheapest capital but most covenant-heavy.</p>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 mb-1">Mezzanine</div>
                      <p className="text-xs font-medium text-gray-500 leading-relaxed">Bridges the gap to 85% LTC at a higher cost.</p>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 mb-1">Equity</div>
                      <p className="text-xs font-medium text-gray-500 leading-relaxed">First-loss capital. Land can often fill this position.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Unified Why It Matters & Key Benefits Card */}
              <div className="bg-white rounded-2xl shadow-lg shadow-blue-900/5 border border-blue-100 overflow-hidden">
                <div className="grid md:grid-cols-2 divide-x divide-gray-100">
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center"><CheckCircle2 className="h-6 w-6 text-blue-600" /></div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900">Why It Matters</h2>
                    </div>
                    <ul className="space-y-4">
                      {info.importance.map((i, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-700">
                          <CheckCircle2 className="mt-1 h-5 w-5 text-blue-500 flex-shrink-0" />
                          <span className="text-base font-semibold leading-relaxed">{i}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 md:p-8 bg-slate-50/30">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center"><CheckCircle2 className="h-6 w-6 text-green-600" /></div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900">Key Benefits</h2>
                    </div>
                    <ul className="space-y-4">
                      {info.benefits.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-700">
                          <CheckCircle2 className="mt-1 h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-base font-semibold leading-relaxed">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Loan Types */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg shadow-gray-100/50 border border-gray-100">
                <SectionHeading eyebrow="Product menu" title="Six ways a project gets funded" sub="Most projects blend more than one option to maximize leverage and minimize cost." />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {loanTypes.map((lt) => {
                    const Icon = lt.icon;
                    return (
                      <div key={lt.name} className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 hover:border-blue-300 hover:shadow-md transition-all">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                          <Icon size={22} strokeWidth={2} className="text-blue-700" />
                        </div>
                        <div className="text-base font-bold leading-snug text-gray-900 mb-3">{lt.name}</div>
                        <div className="cf-mono space-y-2 text-xs font-bold text-gray-500 mb-4">
                          <div className="flex justify-between border-b border-gray-50 pb-1"><span>LEVERAGE</span><span className="text-gray-900">{lt.ltc}</span></div>
                          <div className="flex justify-between border-b border-gray-50 pb-1"><span>EST. RATE</span><span className="text-gray-900">{lt.rate}</span></div>
                          <div className="flex justify-between"><span>TENURE</span><span className="text-gray-900">{lt.term}</span></div>
                        </div>
                        <p className="mt-auto pt-3 border-t border-gray-100 text-xs font-medium leading-relaxed text-gray-500">{lt.bestFor}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ratios */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg shadow-gray-100/50 border border-gray-100">
                <SectionHeading eyebrow="Underwriting" title="The three ratios that size the loan" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {ratios.map((r) => (
                    <div key={r.label} className="rounded-xl border border-gray-200 bg-gray-50 p-5 shadow-sm">
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="text-2xl font-bold text-gray-900">{r.label}</span>
                        <span className="cf-mono text-xs font-bold text-blue-700">{r.range}</span>
                      </div>
                      <div className="cf-mono text-xs font-bold text-gray-400 mb-3">{r.formula}</div>
                      <p className="text-sm font-medium leading-relaxed text-gray-600">{r.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rate Table */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg shadow-gray-100/50 border border-gray-100">
                <SectionHeading eyebrow="Pricing" title="2026 rate and leverage snapshot" sub="Actual pricing depends on sponsor track record, asset class, and market liquidity." />
                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full min-w-[600px] text-left text-sm">
                    <thead><tr className="cf-mono uppercase tracking-wider bg-slate-900 text-white">
                      <th className="px-5 py-4 font-bold">Lender type</th><th className="px-5 py-4 font-bold">Rate</th><th className="px-5 py-4 font-bold">Leverage</th><th className="px-5 py-4 font-bold">Time to close</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-100">
                      {rateRows.map((row, i) => (
                        <tr key={row.lender} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                          <td className="px-5 py-4 font-bold text-gray-900">{row.lender}</td>
                          <td className="cf-mono px-5 py-4 font-bold text-blue-600">{row.rate}</td>
                          <td className="cf-mono px-5 py-4 font-bold text-gray-700">{row.leverage}</td>
                          <td className="cf-mono px-5 py-4 font-medium text-gray-500">{row.speed}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Requirements: Eligibility & Documentation */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 md:p-7 shadow-lg shadow-gray-100/50 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"><CheckCircle2 className="h-6 w-6 text-blue-600" /></div>
                    Eligibility
                  </h2>
                  <div className="space-y-3">
                    {eligibility.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0 mt-1" />
                        <span className="text-sm font-medium text-gray-700 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 md:p-7 shadow-lg shadow-gray-100/50 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center"><ClipboardList size={22} className="text-indigo-700" /></div>
                    Documentation
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-bold text-indigo-700 uppercase tracking-widest mb-2">Residential</div>
                      <ul className="grid grid-cols-1 gap-2">
                        {docsResidential.slice(0, 4).map((d, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-indigo-50/30 p-2 rounded-lg border border-indigo-100/50">
                            <FileText size={12} className="text-indigo-500" /> {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-2">Commercial</div>
                      <ul className="grid grid-cols-1 gap-2">
                        {docsCommercial.slice(0, 4).map((d, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-blue-50/30 p-2 rounded-lg border border-blue-100/50">
                            <FileText size={12} className="text-blue-500" /> {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* What We Do + How It Works */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-6 md:p-7 text-white h-full">
                  <h2 className="text-xl font-bold mb-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><FileCheck className="h-5 w-5" /></div>
                    What We Do
                  </h2>
                  <ul className="space-y-3">
                    {info.whatWeDo!.map((text, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-blue-100">
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-300 flex-shrink-0" />
                        <span className="text-sm leading-relaxed">{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-6 md:p-7 text-white h-full">
                  <h2 className="text-xl font-bold mb-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><TrendingUp className="h-5 w-5" /></div>
                    How It Works
                  </h2>
                  <ul className="space-y-3">
                    {info.howItWorks!.map((text, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-green-100">
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-green-300 flex-shrink-0" />
                        <span className="text-sm leading-relaxed">{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Scenarios */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg shadow-gray-100/50 border border-gray-100">
                <SectionHeading eyebrow="Real examples" title="Real-World Project Scenarios" sub="How we solve complex project funding challenges." />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {scenarios.map((scenario, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex flex-col h-full">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold mb-4 shadow-sm">{idx + 1}</div>
                      <h3 className="font-bold text-gray-900 mb-2">{scenario.title}</h3>
                      <p className="text-sm font-medium text-gray-600 leading-relaxed">{scenario.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg shadow-gray-100/50 border border-gray-100">
                <SectionHeading eyebrow="Questions" title="Frequently asked" />
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 divide-y md:divide-y-0 divide-gray-100">
                  {faqs.map((f, i) => {
                    const open = openFaq === i;
                    return (
                      <div key={f.q} className="border-b md:border-b-0 border-gray-100 last:border-0">
                        <button onClick={() => setOpenFaq(open ? null : i)} className="flex w-full items-center justify-between gap-3 py-4 text-left">
                          <span className="text-sm md:text-base font-bold text-gray-900">{f.q}</span>
                          <ChevronDown size={20} className="text-blue-600 flex-shrink-0 transition-transform" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
                        </button>
                        {open && <p className="pb-4 text-sm font-medium leading-relaxed text-gray-500">{f.a}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Enquiry Form */}
            <div className="lg:col-span-4">
              <div className="sticky top-6">
                <ServiceEnquiryForm />
              </div>
            </div>
          </div>

          {/* Bottom Footer Section: CTA & Direct Contact */}
          <div className="grid lg:grid-cols-12 gap-6 mt-6">
            {/* CTA Banner */}
            <div className="lg:col-span-8 bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl p-8 md:p-12 flex flex-col justify-center text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Fund Your Next Project?</h2>
                <p className="text-blue-100 mb-8 max-w-xl text-base md:text-lg font-medium leading-relaxed">
                  Get expert consultation on construction finance tailored to your project. Quick assessment, multiple lender options, and end-to-end support.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="tel:+919324592709" className="inline-flex items-center gap-3 bg-white text-blue-900 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-lg shadow-blue-900/20">
                    <Phone className="h-5 w-5" /> Call: +91 93245 92709
                  </a>
                  <a href="https://wa.me/919324592709" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-green-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-green-600 transition-all shadow-lg shadow-green-900/20">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.3A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </div>

            {/* Direct Contact Card */}
            <div className="lg:col-span-4">
              <ServiceDirectContact />
            </div>
          </div>

          {/* Disclaimer footer */}
          <div className="mt-5 flex flex-col gap-2 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2"><Percent size={15} className="text-blue-600" /><span className="cf-mono text-[11px] text-gray-400">Rates and ratios are illustrative 2026 ranges, not a quote.</span></div>
            <div className="flex items-center gap-2"><Clock size={15} className="text-blue-600" /><span className="cf-mono text-[11px] text-gray-400">Educational content only — consult a licensed lender or advisor before committing capital.</span></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Finance;
