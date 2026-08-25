export type Info = {
  title: string;
  description: string;
  importance: string[];
  benefits: string[];
  whatWeDo?: string[];
  howItWorks?: string[];
  faqs?: { q: string; a: string }[];
};

export const infos: Record<string, Info> = {
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

  // Navbar Dropdown Service Pages
  "home-loan": {
    title: "Home Loan",
    description:
      "Secure your dream home with the right home loan. We help you compare interest rates, eligibility, and documentation across multiple banks and NBFCs to find the best fit for your needs.",
    importance: [
      "Compare home loan interest rates from 20+ banks",
      "Understand eligibility based on income and credit score",
      "Get guidance on down payment and EMI planning",
      "Assistance with property verification and legal checks",
    ],
    benefits: [
      "Best interest rates tailored to your profile",
      "Faster approval with complete documentation support",
      "Balance transfer and top-up loan options",
      "End-to-end service from application to disbursal",
    ],
  },
  "loan-against-property": {
    title: "Loan Against Property",
    description:
      "Leverage your residential or commercial property to get funds for business or personal needs. Get higher loan amounts with lower interest rates compared to unsecured loans.",
    importance: [
      "Higher loan eligibility based on property value",
      "Lower interest rates than personal loans",
      "Flexible repayment tenure up to 15 years",
      "Continue using your property while repaying",
    ],
    benefits: [
      "Quick processing with minimal documentation",
      "Competitive rates from multiple lenders",
      "Funds for business expansion or personal needs",
      "No restriction on end-use of funds",
    ],
  },
  "msme-loan": {
    title: "MSME Loan",
    description:
      "Fuel your small business growth with tailored MSME loans. Access working capital, machinery purchase, or expansion funding with government scheme benefits.",
    importance: [
      "Access to priority sector lending benefits",
      "Lower interest rates under government schemes",
      "Collateral-free options up to ₹2 crore under CGTMSE",
      "Quick approval with minimal documentation",
    ],
    benefits: [
      "Working capital for day-to-day operations",
      "Term loans for machinery and expansion",
      "Subsidy benefits under MSME schemes",
      "Expert guidance on eligibility and documentation",
    ],
  },
  "construction-finance": {
    title: "Construction Finance",
    description:
      "Get specialized funding for real estate construction projects. From land acquisition to project completion, access structured finance solutions for builders and developers.",
    importance: [
      "Funding for land acquisition and construction",
      "Staged disbursement based on project progress",
      "Flexible repayment linked to sales velocity",
      "Higher loan amounts based on project viability",
      "Bridge the cash-flow gap between project outflows and sales inflows",
      "Cover material, labor, and contractor costs without tying up working capital",
    ],
    benefits: [
      "Competitive interest rates for developers",
      "Quick sanction with project assessment",
      "Multiple lender options for best terms",
      "Technical and legal support throughout",
      "Customized loan structures for residential, commercial, and industrial projects",
      "Pre-approval facility to accelerate project launch timelines",
    ],
    whatWeDo: [
      "Assess project viability including land status, approvals, and market demand.",
      "Structure construction finance with optimal LTV, tenure, and draw schedule.",
      "Connect with banks, NBFCs, and private lenders for the best terms.",
      "Coordinate technical, legal, and valuation due diligence with lenders.",
      "Manage staged disbursement tracking aligned to construction milestones.",
      "Provide ongoing monitoring and reporting support till project completion.",
    ],
    howItWorks: [
      "Initial consultation: project scope, land details, and funding requirement.",
      "Feasibility analysis and lender shortlisting based on project profile.",
      "Documentation: approvals, IGR, RERA, project cost sheet, and developer track record.",
      "Lender due diligence: technical, legal, and valuation assessments.",
      "Sanction and draw schedule finalization aligned to construction milestones.",
      "Staged disbursal linked to project progress with ongoing monitoring.",
    ],
    faqs: [
      {
        q: "What is construction finance?",
        a: "Construction finance is a specialized loan product for builders and developers to fund real estate construction projects. It covers land acquisition, construction costs, and project expenses with staged disbursements linked to construction milestones.",
      },
      {
        q: "Who is eligible for construction finance?",
        a: "Builders, developers, and construction companies with approved projects, clear land titles, and necessary regulatory approvals (RERA, local authority) are eligible. A strong track record and project viability are key factors.",
      },
      {
        q: "How is the loan disbursed?",
        a: "Construction loans are typically disbursed in stages linked to project milestones — foundation, slab casting, brickwork, finishing, and occupancy certificate. Each draw is released after lender-approved technical verification.",
      },
      {
        q: "What is the typical loan-to-value (LTV) ratio?",
        a: "LTV ratios generally range from 50% to 70% of the project cost, depending on the lender, project type, location, and developer profile. Higher LTV may be available for established developers with strong track records.",
      },
      {
        q: "What documents are required?",
        a: "Key documents include project approvals (RERA, building plan, environmental clearance), land title documents, developer financials, project cost breakdown, contractor agreements, and KYC documents.",
      },
      {
        q: "Can I get construction finance for a residential project?",
        a: "Yes. Construction finance is available for residential, commercial, retail, and industrial projects. Residential projects with strong pre-sales or market demand typically receive favorable terms.",
      },
    ],
  },
  "life-insurance": {
    title: "Life Insurance",
    description:
      "Protect your family's financial future with the right life insurance cover. Compare term plans, endowment policies, and ULIPs to ensure your loved ones are secure.",
    importance: [
      "Financial security for dependents",
      "Tax benefits under Section 80C and 10(10D)",
      "Cover for loans and liabilities",
      "Wealth creation with investment-linked plans",
    ],
    benefits: [
      "Compare plans from top insurers",
      "Right coverage amount based on your needs",
      "Affordable premiums with maximum coverage",
      "Claim settlement assistance",
    ],
    whatWeDo: [
      "Analyze your life cover needs based on liabilities and goals.",
      "Compare term plans, ULIPs, and endowment policies.",
      "Assist with medical check-up coordination.",
      "Guide through the documentation and nomination process.",
    ],
    howItWorks: [
      "Need assessment and goal profiling.",
      "Plan comparison and selection.",
      "Proposal submission and medicals (if required).",
      "Policy issuance and regular reviews.",
    ],
    faqs: [
      {
        q: "What is the right age to buy life insurance?",
        a: "The earlier you buy, the lower the premium. It is ideal to buy when you have dependents or liabilities.",
      },
      {
        q: "Can I have multiple life insurance policies?",
        a: "Yes, you can have multiple policies, but you must disclose existing covers to all insurers.",
      },
      {
        q: "How are claims settled?",
        a: "Nominees need to submit the death certificate and policy documents to the insurer. We provide assistance during the claim process.",
      },
    ],
  },
  "health-insurance": {
    title: "Health Insurance",
    description:
      "Safeguard against rising medical costs with comprehensive health insurance. Get cashless hospitalization, coverage for critical illnesses, and family floater options.",
    importance: [
      "Protection against medical emergencies",
      "Cashless treatment at network hospitals",
      "Coverage for pre and post-hospitalization",
      "Tax deduction under Section 80D",
    ],
    benefits: [
      "Compare plans from leading insurers",
      "Family floater for complete family coverage",
      "Critical illness and accident riders",
      "No-claim bonus and restoration benefits",
    ],
    whatWeDo: [
      "Evaluate family health risks and existing coverage.",
      "Compare network hospitals and cashless facilities.",
      "Explain waiting periods, co-payments, and sub-limits.",
      "Assist in renewal and portability if needed.",
    ],
    howItWorks: [
      "Requirement analysis (Individual/Family Floater).",
      "Comparison of premiums and coverage features.",
      "Proposal filing and verification.",
      "Policy activation and cashless card issuance.",
    ],
    faqs: [
      {
        q: "What is a cashless facility?",
        a: "It allows you to get treated at network hospitals without paying upfront; the insurer settles bills directly.",
      },
      {
        q: "What are pre-existing diseases?",
        a: "Conditions you had before buying the policy. They usually have a waiting period of 2-4 years.",
      },
      {
        q: "Can I port my health insurance?",
        a: "Yes, you can port to another insurer at the time of renewal without losing credits for waiting periods.",
      },
    ],
  },
  "general-insurance": {
    title: "General Insurance",
    description:
      "Comprehensive coverage for your assets - motor insurance, property insurance, travel insurance, and more. Protect what matters most with the right general insurance policy.",
    importance: [
      "Asset protection against unforeseen events",
      "Legal compliance (motor insurance)",
      "Financial security for property and belongings",
      "Coverage for travel and business risks",
    ],
    benefits: [
      "Compare policies from multiple insurers",
      "Best premiums with maximum coverage",
      "Quick claim settlement support",
      "Renewal reminders and policy management",
    ],
    whatWeDo: [
      "Identify risks to your physical and business assets.",
      "Offer customized motor, travel, and fire insurance.",
      "Optimize premiums with correct IDV and add-ons.",
      "Liaise with insurers for speedy claim processing.",
    ],
    howItWorks: [
      "Asset valuation and risk assessment.",
      "Policy customization and premium calculation.",
      "Immediate cover note or policy issuance.",
      "Ongoing support for renewals and claims.",
    ],
    faqs: [
      {
        q: "Is third-party motor insurance mandatory?",
        a: "Yes, it is legally mandatory in India for all vehicles plying on public roads.",
      },
      {
        q: "What does fire insurance cover?",
        a: "It covers damages to property due to fire, lightning, explosion, and other specified perils.",
      },
    ],
  },
  "mutual-funds": {
    title: "Mutual Funds",
    description:
      "Build wealth systematically with mutual fund investments. Get expert guidance on equity, debt, and hybrid funds based on your risk profile and financial goals.",
    importance: [
      "Diversified investment with professional management",
      "Start investing with as low as ₹500 via SIP",
      "Goal-based investing for all life stages",
      "Tax-saving with ELSS under Section 80C",
    ],
    benefits: [
      "Curated fund recommendations",
      "Portfolio review and rebalancing",
      "SIP and lumpsum investment options",
      "Regular performance tracking and guidance",
    ],
    whatWeDo: [
      "Assess risk appetite and financial goals.",
      "Recommend top-performing funds across categories.",
      "Facilitate easy SIP or lumpsum onboarding.",
      "Provide periodic portfolio performance reports.",
    ],
    howItWorks: [
      "KYC verification and onboarding.",
      "Investment strategy and fund selection.",
      "Transaction execution (Buy/Sell/Switch).",
      "Ongoing monitoring and rebalancing.",
    ],
    faqs: [
      {
        q: "What is an SIP?",
        a: "Systematic Investment Plan (SIP) allows you to invest a fixed amount regularly (monthly/quarterly) in mutual funds.",
      },
      {
        q: "Are mutual funds safe?",
        a: "They are subject to market risks, but diversification helps manage risk over the long term.",
      },
    ],
  },
  "fixed-deposit": {
    title: "Fixed Deposit",
    description:
      "Earn guaranteed returns with fixed deposits. Compare FD rates across banks and NBFCs to maximize your returns with capital protection.",
    importance: [
      "Guaranteed returns with capital safety",
      "Higher interest rates than savings accounts",
      "Flexible tenure from 7 days to 10 years",
      "Loan facility against FD without breaking it",
    ],
    benefits: [
      "Compare FD rates from 20+ institutions",
      "Senior citizen extra interest options",
      "Tax-saving FDs under Section 80C",
      "Easy online booking and renewal",
    ],
    whatWeDo: [
      "Scan top FD rates across banks and NBFCs.",
      "Analyze credit ratings for corporate FDs.",
      "Optimize tenure for maximum yield.",
      "Assist in digital application and documentation.",
    ],
    howItWorks: [
      "Comparison of interest rates and ratings.",
      "Selection of tenure and payout (cumulative/regular).",
      "Form submission and fund transfer.",
      "Receipt of FD certificate.",
    ],
    faqs: [
      {
        q: "Can I break my FD before maturity?",
        a: "Yes, but it usually involves a premature withdrawal penalty of 0.5% to 1%.",
      },
      {
        q: "Is FD interest taxable?",
        a: "Yes, interest is added to your income and taxed as per your slab. TDS is applicable if interest exceeds a certain limit.",
      },
    ],
  },
  "bonds": {
    title: "Bonds",
    description:
      "Invest in bonds for stable, predictable returns. Access government bonds, corporate bonds, and tax-free bonds with expert guidance on selection and portfolio allocation.",
    importance: [
      "Regular interest income with capital safety",
      "Lower risk than equity investments",
      "Diversification for balanced portfolio",
      "Tax-free income with government bonds",
    ],
    benefits: [
      "Access to government and corporate bonds",
      "Compare yields and credit ratings",
      "Tax-efficient investment options",
      "Expert guidance on bond selection",
    ],
    whatWeDo: [
      "Source primary and secondary market bonds.",
      "Advise on credit quality and yield-to-maturity (YTM).",
      "Facilitate purchase of tax-free and 54EC bonds.",
      "Guide on bond laddering for regular cash flow.",
    ],
    howItWorks: [
      "Identification of suitable bond types.",
      "Analysis of credit ratings and coupon rates.",
      "Transaction execution via secondary market or direct.",
      "Holding in Demat account and interest tracking.",
    ],
    faqs: [
      {
        q: "What are Tax-Free Bonds?",
        a: "These are bonds issued by government-backed entities where interest earned is completely tax-exempt.",
      },
      {
        q: "What is Credit Rating in bonds?",
        a: "It indicates the issuer's ability to pay interest and principal. AAA is the highest and safest rating.",
      },
    ],
  },
};

export const slugTitleMap: Record<string, string> = Object.fromEntries(
  Object.keys(infos).map((k) => [k, infos[k].title])
);
