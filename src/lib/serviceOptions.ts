export const ENQUIRY_SERVICE_VALUES = [
  "home_loan",
  "loan_against_property",
  "msme_loan",
  "life_insurance",
  "health_insurance",
  "general_insurance",
  "mutual_funds",
  "fixed_deposits",
  "bonds",
  "alternate",
  "auction",
] as const;

export type EnquiryServiceValue = (typeof ENQUIRY_SERVICE_VALUES)[number];

export const ENQUIRY_SERVICE_OPTIONS: Array<{ label: string; value: EnquiryServiceValue }> = [
  { label: "Home Loan", value: "home_loan" },
  { label: "Loan Against Property", value: "loan_against_property" },
  { label: "MSME / Working Capital Finance", value: "msme_loan" },
  { label: "Life Insurance", value: "life_insurance" },
  { label: "Health Insurance", value: "health_insurance" },
  { label: "General Insurance", value: "general_insurance" },
  { label: "Mutual Funds", value: "mutual_funds" },
  { label: "Fixed Deposits", value: "fixed_deposits" },
  { label: "Bonds", value: "bonds" },
];

export const normalizeEnquiryService = (value: unknown): EnquiryServiceValue | "" => {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) return "";

  // Backward compatibility for legacy value.
  if (normalized === "investment" || normalized === "mutual_fund") return "mutual_funds";
  if (normalized === "loan") return "home_loan";
  if (normalized === "insurance") return "life_insurance";

  if (ENQUIRY_SERVICE_VALUES.includes(normalized as EnquiryServiceValue)) {
    return normalized as EnquiryServiceValue;
  }

  return "";
};

export const inferEnquiryServiceFromContext = (value: unknown): EnquiryServiceValue | "" => {
  const normalized = String(value || "").toLowerCase();
  if (!normalized) return "";

  if (normalized.includes("home-loan")) return "home_loan";
  if (normalized.includes("loan-against-property")) return "loan_against_property";
  if (normalized.includes("msme")) return "msme_loan";
  if (normalized.includes("life-insurance")) return "life_insurance";
  if (normalized.includes("health-insurance")) return "health_insurance";
  if (normalized.includes("general-insurance")) return "general_insurance";
  if (normalized.includes("mutual-fund")) return "mutual_funds";
  if (normalized.includes("fixed-deposit")) return "fixed_deposits";
  if (normalized.includes("bond")) return "bonds";
  if (normalized.includes("auction")) return "auction";
  if (normalized.includes("alternate") || normalized.includes("distress")) return "alternate";

  return "";
};