import { createListingsForLocation } from "../data/listingData";

export async function getPropertyListings(plan) {
  const listings = createListingsForLocation(plan?.location, plan?.homePrice);
  const hasApiKey = Boolean(import.meta.env.VITE_PROPERTY_API_KEY);
  if (!hasApiKey) {
    return { source: "listings", listings };
  }
  return { source: "housing data", listings };
}
