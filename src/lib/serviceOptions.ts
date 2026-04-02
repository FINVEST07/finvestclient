export const ENQUIRY_SERVICE_VALUES = [
  "loan",
  "insurance",
  "mutual_fund",
  "alternate",
  "auction",
] as const;

export type EnquiryServiceValue = (typeof ENQUIRY_SERVICE_VALUES)[number];

export const ENQUIRY_SERVICE_OPTIONS: Array<{ label: string; value: EnquiryServiceValue }> = [
  { label: "Loan", value: "loan" },
  { label: "Insurance", value: "insurance" },
  { label: "Mutual Fund", value: "mutual_fund" },
  { label: "Alternate Investment", value: "alternate" },
  { label: "Auction Properties", value: "auction" },
];

export const normalizeEnquiryService = (value: unknown): EnquiryServiceValue | "" => {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) return "";

  // Backward compatibility for legacy value.
  if (normalized === "investment") return "mutual_fund";

  if (ENQUIRY_SERVICE_VALUES.includes(normalized as EnquiryServiceValue)) {
    return normalized as EnquiryServiceValue;
  }

  return "";
};

export const inferEnquiryServiceFromContext = (value: unknown): EnquiryServiceValue | "" => {
  const normalized = String(value || "").toLowerCase();
  if (!normalized) return "";

  if (normalized.includes("auction")) return "auction";
  if (normalized.includes("alternate") || normalized.includes("distress")) return "alternate";

  return "";
};