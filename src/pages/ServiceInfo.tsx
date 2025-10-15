import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ToastContainerComponent from "@/components/ToastContainerComponent";
import { ArrowLeft, ChevronRight } from "lucide-react";

type Info = {
  title: string;
  description: string;
  importance: string[];
  benefits: string[];
};

const infos: Record<string, Info> = {
  "home-loan-agent": {
    title: "Home Loan Agent",
    description:
      "A Home Loan Agent assists borrowers in finding, applying for, and securing the right home loan by comparing lenders, rates, and documentation needs.",
    importance: [
      "Saves time by handling lender coordination and paperwork",
      "Helps you qualify by guiding eligibility and credit improvement",
      "Finds competitive interest rates and suitable products",
    ],
    benefits: [
      "Personalized loan options from multiple banks/NBFCs",
      "End-to-end assistance from application to disbursal",
      "Better approval chances with documentation hygiene",
    ],
  },
  "home-loan-consultant": {
    title: "Home Loan Consultant",
    description:
      "A Home Loan Consultant provides expert advisory on choosing the best home loan product and structuring your application for fast approval.",
    importance: [
      "Objective analysis of interest types (fixed/floating)",
      "Optimizes tenure, EMI, and down payment",
      "Advises on fees, foreclosure, and hidden charges",
    ],
    benefits: [
      "Clarity on total cost of ownership",
      "Tailored bank recommendations",
      "Reduced processing delays",
    ],
  },
  "home-loan-dsa": {
    title: "Home Loan DSA",
    description:
      "A Direct Selling Agent (DSA) partners with lenders to source and facilitate home loan applications for eligible customers.",
    importance: [
      "Access to multiple banks through one channel",
      "Helps with documentation and eligibility checks",
      "Speeds up the application workflow",
    ],
    benefits: [
      "Single-window process for many lenders",
      "Transparent status updates",
      "Assistance with queries and conditions",
    ],
  },
  "home-loan-advisor": {
    title: "Home Loan Advisor",
    description:
      "A Home Loan Advisor helps you compare home loan options and decide the most suitable plan based on income, credit, and property value.",
    importance: [
      "Explains impact of rate changes on EMIs",
      "Guides on balance transfer and top-up",
      "Advises on co-applicant strategy",
    ],
    benefits: [
      "Informed decision-making",
      "Lower overall interest outgo",
      "Long-term support",
    ],
  },

  "mortgage-loan-agent": {
    title: "Mortgage Loan Agent",
    description:
      "A Mortgage Loan Agent helps you secure loans against property by matching your need with lenders' LTV and policy.",
    importance: [
      "Understands property valuation and LTV",
      "Improves approval odds with correct profiling",
      "Aligns loan amount with cash flow",
    ],
    benefits: [
      "Faster disbursals",
      "Better rates and terms",
      "Minimized documentation errors",
    ],
  },
  "mortgage-loan-consultant": {
    title: "Mortgage Loan Consultant",
    description:
      "Advises on loan against property structures, tenure, and risk to optimize borrowing.",
    importance: [
      "Selects right product (OD/Term loan)",
      "Assesses repayment capacity and risks",
      "Plans foreclosure and part-payment",
    ],
    benefits: [
      "Cost-effective borrowing",
      "Reduced processing time",
      "Clear terms and conditions",
    ],
  },
  "mortgage-loan-dsa": {
    title: "Mortgage Loan DSA",
    description:
      "DSA bridges customers and lenders for mortgage loans with streamlined processing.",
    importance: [
      "Single point access to banks/NBFCs",
      "Documentation and verification guidance",
      "Status follow-ups",
    ],
    benefits: ["Time saving", "Multiple offers", "Higher approval chances"],
  },
  "mortgage-loan-advisor": {
    title: "Mortgage Loan Advisor",
    description:
      "Advises on leveraging property for business or personal needs while managing risks.",
    importance: ["Right LTV selection", "Rate type advice", "Sanction planning"],
    benefits: ["Optimized EMI", "Lower interest cost", "Better lender fit"],
  },

  "cgtmse-agent": {
    title: "CGTMSE Agent",
    description:
      "Assists MSMEs in availing collateral-free loans under CGTMSE by matching lender schemes and preparing proposals.",
    importance: ["Eligibility mapping", "Subsidy/guarantee navigation", "Documentation"],
    benefits: ["Collateral-free access", "Better approval odds", "Faster turnaround"],
  },
  "cgtmse-consultant": {
    title: "CGTMSE Consultant",
    description:
      "Consults MSMEs on structuring working capital/term loans with CGTMSE coverage.",
    importance: ["Risk mitigation", "Cash-flow alignment", "Scheme selection"],
    benefits: ["Lower risk", "Improved terms", "Speed to credit"],
  },
  "cgtmse-dsa": {
    title: "CGTMSE DSA",
    description:
      "Facilitates CGTMSE-backed applications with lenders and simplifies processing.",
    importance: ["Bank network", "End-to-end assistance", "Follow-ups"],
    benefits: ["Less hassle", "Multiple options", "Quick processing"],
  },
  "cgtmse-advisor": {
    title: "CGTMSE Advisor",
    description:
      "Advises MSMEs on collateral-free lending policies and guarantees under CGTMSE.",
    importance: ["Policy clarity", "Right ticket size", "Repayment planning"],
    benefits: ["Reduced cost of funds", "Smoother approval", "Sustainable debt"],
  },

  "msme-loan-agent": {
    title: "MSME Loan Agent",
    description:
      "Helps micro, small, and medium businesses secure loans for working capital or expansion.",
    importance: ["Profiling", "Bank mapping", "Application prep"],
    benefits: ["Faster approvals", "Better terms", "Ongoing support"],
  },
  "msme-loan-consultant": {
    title: "MSME Loan Consultant",
    description:
      "Advises on MSME credit structures, subsidies, and policy alignment.",
    importance: ["Scheme selection", "Risk and cash-flow", "Compliance"],
    benefits: ["Lower risk", "Right product", "Transparency"],
  },
  "msme-loan-dsa": {
    title: "MSME Loan DSA",
    description:
      "Connects MSMEs with lenders and manages processing.",
    importance: ["Single-window access", "Paperwork", "Follow-ups"],
    benefits: ["Time saving", "Choice of lenders", "Quicker TAT"],
  },
  "msme-loan-advisor": {
    title: "MSME Loan Advisor",
    description:
      "Guides MSMEs to choose suitable loan options and repayment plans.",
    importance: ["Ticket size logic", "Tenure fit", "Risk control"],
    benefits: ["Sustainable debt", "Lower interest burden", "Clarity"],
  },

  "business-loan-agent": {
    title: "Business Loan Agent",
    description:
      "Supports businesses in obtaining unsecured or secured business loans.",
    importance: ["Eligibility", "Docs readiness", "Bank fit"],
    benefits: ["Quicker approvals", "Competitive rates", "Minimal hassle"],
  },
  "business-loan-consultant": {
    title: "Business Loan Consultant",
    description:
      "Consults on working capital, term loans, and cash-credit structures.",
    importance: ["Product strategy", "EMI planning", "Lender selection"],
    benefits: ["Optimized cost", "Better cash-flow", "Fewer surprises"],
  },
  "business-loan-dsa": {
    title: "Business Loan DSA",
    description:
      "Facilitates business loan sourcing and tracking across lenders.",
    importance: ["Network access", "Single touchpoint", "Processing help"],
    benefits: ["Time saving", "Multiple offers", "Status visibility"],
  },
  "business-loan-advisor": {
    title: "Business Loan Advisor",
    description:
      "Advises on suitable business credit options based on turnover and risk.",
    importance: ["Right product mix", "Term vs CC", "Exposure control"],
    benefits: ["Improved financial health", "Lower cost", "Strategic leverage"],
  },

  "personal-loan-agent": {
    title: "Personal Loan Agent",
    description:
      "Assists individuals in obtaining personal loans suited to their needs.",
    importance: ["Eligibility checks", "Documentation", "Rate comparison"],
    benefits: ["Fast disbursal", "Better rates", "Minimal paperwork"],
  },
  "personal-loan-consultant": {
    title: "Personal Loan Consultant",
    description:
      "Advises on selecting personal loans with responsible borrowing.",
    importance: ["EMI planning", "Tenure selection", "Fees clarity"],
    benefits: ["Lower total cost", "Fewer penalties", "Smart decisions"],
  },
  "personal-loan-dsa": {
    title: "Personal Loan DSA",
    description:
      "DSA connects you to multiple lenders for quick personal loans.",
    importance: ["Single channel", "Short TAT", "Process support"],
    benefits: ["Speed", "Choice", "Convenience"],
  },
  "personal-loan-advisor": {
    title: "Personal Loan Advisor",
    description:
      "Advises on responsible personal credit and refinancing options.",
    importance: ["Debt planning", "Balance transfer", "Credit score advice"],
    benefits: ["Lower burden", "Healthy credit score", "Clarity"],
  },

  "life-insurance-agent": {
    title: "Life Insurance Agent",
    description:
      "Guides you in selecting term, endowment, or ULIP plans based on goals and dependents.",
    importance: ["Risk protection", "Tax benefits", "Goal alignment"],
    benefits: ["Financial security", "Affordable cover", "Custom riders"],
  },
  "life-insurance-consultant": {
    title: "Life Insurance Consultant",
    description:
      "Advises on life cover adequacy, riders, and policy suitability.",
    importance: ["Coverage planning", "Claims clarity", "Rider fit"],
    benefits: ["Right cover", "Better claims experience", "Long-term value"],
  },
  "life-insurance-advisor": {
    title: "Life Insurance Advisor",
    description:
      "Helps you select the most appropriate life insurance plan and maintain it wisely.",
    importance: ["Protection planning", "Premium fit", "Policy reviews"],
    benefits: ["Continuity", "Sufficient protection", "Peace of mind"],
  },

  "health-insurance-agent": {
    title: "Health Insurance Agent",
    description:
      "Assists with choosing health plans with adequate sum insured, network, and features.",
    importance: ["Medical cost protection", "Cashless network", "Claim support"],
    benefits: ["Financial relief", "Quality care access", "Tax benefit"],
  },
  "health-insurance-consultant": {
    title: "Health Insurance Consultant",
    description:
      "Advises on family floater vs individual, sub-limits, and add-ons.",
    importance: ["Plan suitability", "Coverage depth", "Claim ratio"],
    benefits: ["Right coverage", "Smooth claims", "Value for money"],
  },
  "health-insurance-advisor": {
    title: "Health Insurance Advisor",
    description:
      "Guides on renewals, portability, and top-ups for sustained coverage.",
    importance: ["Continuity", "Affordability", "Flexibility"],
    benefits: ["Lower gaps", "Reduced out-of-pocket", "Long-term protection"],
  },

  "mutual-fund-agent": {
    title: "Mutual Fund Agent",
    description:
      "Helps you invest in mutual funds aligned to your goals and risk profile.",
    importance: ["Asset allocation", "SIP planning", "Fund selection"],
    benefits: ["Wealth creation", "Diversification", "Convenience"],
  },
  "mutual-fund-consultant": {
    title: "Mutual Fund Consultant",
    description:
      "Advises on constructing and rebalancing MF portfolios.",
    importance: ["Goal mapping", "Risk control", "Tax-efficiency"],
    benefits: ["Better outcomes", "Lower risk", "Optimized returns"],
  },
  "mutual-fund-advisor": {
    title: "Mutual Fund Advisor",
    description:
      "Guides you on long-term investment discipline and reviews.",
    importance: ["Review cadence", "Category selection", "Behavioral coaching"],
    benefits: ["Stay on track", "Balanced portfolio", "Compounding"],
  },
  "mutual-fund-distributor": {
    title: "Mutual Fund Distributor",
    description:
      "Facilitates execution and servicing of MF transactions and folios.",
    importance: ["Onboarding", "Transaction support", "Service"],
    benefits: ["Ease of investing", "Record keeping", "Continuity"],
  },

  "auction-property-advisor": {
    title: "Auction Property Advisor",
    description:
      "Advises on buying bank auction/distress properties, due diligence, and funding.",
    importance: ["Legal checks", "Valuation", "Process guidance"],
    benefits: ["Below-market deals", "Lower risk", "Smooth process"],
  },
  "auction-property-consultant": {
    title: "Auction Property Consultant",
    description:
      "Consults on end-to-end auction purchase including inspection, bidding, and post-sale formalities.",
    importance: ["Eligibility", "Paperwork", "Bid strategy"],
    benefits: ["Confidence", "Transparency", "Timely closure"],
  },
};

const slugTitleMap: Record<string, string> = Object.fromEntries(
  Object.keys(infos).map((k) => [k, infos[k].title])
);

const ServiceInfo = () => {
  const { slug } = useParams();
  const info = useMemo(() => (slug ? infos[slug] : undefined), [slug]);

  const canonicalUrl = typeof window !== "undefined" ? `${window.location.origin}/info/${slug}` : `/info/${slug}`;
  const metaTitle = info ? `${info.title} - FINVESTCORP` : "Service - FINVESTCORP";
  const metaDesc = info ? `${info.title}: ${info.description}` : "Financial services information.";

  return (
    <section className="pt-6 pb-16 bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 min-h-screen">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: info?.title || 'Service',
            description: metaDesc,
            author: { '@type': 'Organization', name: 'FINVESTCORP' },
            publisher: { '@type': 'Organization', name: 'FINVESTCORP', logo: { '@type': 'ImageObject', url: '/fin_lo.png' } },
            mainEntityOfPage: canonicalUrl,
          })}
        </script>
      </Helmet>
      <ToastContainerComponent />
      <div className="container mx-auto px-6">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-900 hover:text-blue-800 font-medium transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {!info ? (
          <div className="text-center text-gray-500 py-20">We couldn't find this page.</div>
        ) : (
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg border border-blue-100/50 overflow-hidden">
            <div className="p-6 md:p-10">
              <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">{info.title}</h1>
              <p className="text-gray-700 leading-relaxed mb-6">{info.description}</p>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-semibold text-blue-900 mb-3">Why it matters</h2>
                  <ul className="list-disc ml-5 space-y-2 text-gray-700">
                    {info.importance.map((i, idx) => (
                      <li key={idx}>{i}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-blue-900 mb-3">Benefits</h2>
                  <ul className="list-disc ml-5 space-y-2 text-gray-700">
                    {info.benefits.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Additional depth sections to improve topical coverage */}
              <div className="mt-10 grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-semibold text-blue-900 mb-3">What we do</h2>
                  <ul className="list-disc ml-5 space-y-2 text-gray-700">
                    <li>Understand your goals, eligibility, and constraints to tailor recommendations.</li>
                    <li>Shortlist suitable banks/NBFCs and products after policy and rate comparison.</li>
                    <li>Guide documentation, application filing, and respond to lender queries.</li>
                    <li>Negotiate terms where possible and track the case till sanction and disbursal.</li>
                  </ul>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-blue-900 mb-3">How it works</h2>
                  <ol className="list-decimal ml-5 space-y-2 text-gray-700">
                    <li>Initial consultation and profiling.</li>
                    <li>Option comparison with pros/cons and total cost.</li>
                    <li>Application submission and verification.</li>
                    <li>Sanction, documentation, and final disbursal.</li>
                  </ol>
                </div>
              </div>

              <div className="mt-10">
                <h2 className="text-xl font-semibold text-blue-900 mb-3">Who should choose this</h2>
                <ul className="list-disc ml-5 space-y-2 text-gray-700">
                  <li>First-time applicants seeking clarity and faster turnaround.</li>
                  <li>Borrowers comparing multiple lenders and structures.</li>
                  <li>Applicants needing help with paperwork and lender communication.</li>
                  <li>Anyone optimizing cost of funds and long-term terms.</li>
                </ul>
              </div>

              <div className="mt-10">
                <h2 className="text-xl font-semibold text-blue-900 mb-3">FAQs</h2>
                <div className="space-y-4 text-gray-700">
                  <div>
                    <p className="font-medium text-blue-900">How long does the process take?</p>
                    <p>Timelines vary by lender and profile. With complete documents, most cases move from application to sanction within a few days to a couple of weeks.</p>
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">Do you work with multiple banks/NBFCs?</p>
                    <p>Yes. We compare across lenders to help you choose the option that best fits your requirements and eligibility.</p>
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">Can I restructure later or transfer my loan?</p>
                    <p>We can guide on balance transfers, top-ups, and restructuring options based on market conditions and policy.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/services" className="inline-flex items-center gap-2 bg-blue-900 text-white px-5 py-2.5 rounded-md hover:bg-blue-800">
                  Get Service
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 border border-blue-200 text-blue-900 px-5 py-2.5 rounded-md hover:bg-blue-50">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceInfo;
