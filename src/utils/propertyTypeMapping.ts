/**
 * Central mapping for property listing types
 * 
 * Database values (DO NOT CHANGE):
 * - "Auction" 
 * - "Distress"
 * 
 * UI Labels (can be updated here for display):
 * - "Auction" → "Auction Properties"
 * - "Distress" → "Alternate Investment"
 */

export type PropertyListingType = "Auction" | "Distress";

export const PROPERTY_TYPE_LABELS: Record<PropertyListingType, string> = {
  Auction: "Auction Properties",
  Distress: "Alternate Investment",
};

export const PROPERTY_TYPE_ROUTE: Record<PropertyListingType, string> = {
  Auction: "/investor-zone/auction-properties",
  Distress: "/investor-zone/alternate-investment",
};

/**
 * Get display label for a property type
 */
export const getPropertyTypeLabel = (type: PropertyListingType | string): string => {
  return PROPERTY_TYPE_LABELS[type as PropertyListingType] || "Unknown";
};

/**
 * Get route path for a property type
 */
export const getPropertyTypeRoute = (type: PropertyListingType | string): string => {
  return PROPERTY_TYPE_ROUTE[type as PropertyListingType] || "/investor-zone/auction-properties";
};

/**
 * Normalize type for internal comparison (lowercase)
 */
export const normalizePropertyType = (value: unknown): string => {
  return String(value || "").trim().toLowerCase();
};

/**
 * Check if type is "Distress" (for alternate investment)
 */
export const isAlternateInvestment = (type: PropertyListingType | string): boolean => {
  const normalized = normalizePropertyType(type);
  return normalized === "distress" || normalized === "alternate";
};
