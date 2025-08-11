// constants.js
// Global constants, enums, and labels used throughout the app

export const APP_NAME = "MarketConnect";
export const APP_TAGLINE = "Connecting Buyers and Sellers Seamlessly";

// Navigation Routes
export const ROUTES = {
  DASHBOARD: "/dashboard",
  BUYERS: "/buyers",
  SELLERS: "/sellers",
  MATCH_WORKBENCH: "/matches",
  SETTINGS: "/settings",
  PROFILE: "/profile",
  HELP: "/help",
};

// User Roles
export const USER_ROLES = {
  BUYER: "buyer",
  SELLER: "seller",
  ADMIN: "admin",
};

// Deal Status
export const DEAL_STATUS = {
  NEW: "new",
  NEGOTIATION: "negotiation",
  UNDER_REVIEW: "under_review",
  CLOSED: "closed",
  CANCELLED: "cancelled",
};

// Match Score Ranges
export const MATCH_SCORE = {
  HIGH: 80,
  MEDIUM: 50,
  LOW: 0,
};

// File Upload Constraints
export const FILE_UPLOAD = {
  MAX_SIZE_MB: 10,
  ALLOWED_TYPES: [
    "application/pdf",
    "application/vnd.ms-excel",
    "image/png",
    "image/jpeg",
  ],
};

// Default Avatars
export const DEFAULT_AVATARS = {
  BUYER: "https://via.placeholder.com/150/007BFF/FFFFFF?text=Buyer",
  SELLER: "https://via.placeholder.com/150/28A745/FFFFFF?text=Seller",
};

// Progress Steps for Deals
export const DEAL_PROGRESS_STEPS = [
  "Initial Contact",
  "Requirement Gathering",
  "Proposal Sent",
  "Negotiation",
  "Deal Closure",
];

// AI Analysis Tags
export const AI_TAGS = [
  "High Potential",
  "Needs Clarification",
  "Risky Deal",
  "Price Sensitive",
  "Urgent",
];

// Buyer Filters
export const BUYER_FILTERS = {
  INDUSTRY: ["Technology", "Healthcare", "Finance", "Retail", "Education"],
  BUDGET_RANGE: ["< $10k", "$10k - $50k", "$50k - $200k", "$200k+"],
  LOCATION: ["North America", "Europe", "Asia", "South America", "Africa"],
};

// Seller Filters
export const SELLER_FILTERS = {
  INDUSTRY: ["Technology", "Healthcare", "Finance", "Retail", "Education"],
  DELIVERY_TIME: ["< 1 month", "1 - 3 months", "3 - 6 months", "6+ months"],
  LOCATION: ["North America", "Europe", "Asia", "South America", "Africa"],
};
