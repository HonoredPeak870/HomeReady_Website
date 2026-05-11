import { calculatePlan } from "./mortgageCalculations.js";

export function scoreListing(listing, userPlan) {
  const listingPlan = calculatePlan({ ...userPlan, homePrice: listing.price });
  let score = 0;
  const strengths = [];
  const concerns = [];

  if (listingPlan.housingRatio <= 28) {
    score += 35;
    strengths.push("the housing payment is within the 28% target");
  } else if (listingPlan.housingRatio <= 33) {
    score += 26;
    concerns.push("the housing payment is a little above the 28% target");
  } else if (listingPlan.housingRatio <= 38) {
    score += 16;
    concerns.push("the housing payment would be tight");
  } else {
    score += 4;
    concerns.push("the housing payment is too high for the income entered");
  }

  if (listingPlan.dtiRatio <= 36) {
    score += 25;
    strengths.push("total debt-to-income is in a strong range");
  } else if (listingPlan.dtiRatio <= 43) {
    score += 19;
    strengths.push("total debt-to-income is still under 43%");
  } else if (listingPlan.dtiRatio <= 50) {
    score += 9;
    concerns.push("total debt-to-income is above a common lender comfort zone");
  } else {
    concerns.push("total debt-to-income is very high");
  }

  const cashTarget = listingPlan.requiredDownPayment + listingPlan.emergencyTarget;
  const savingsCoverage = cashTarget > 0 ? listingPlan.savings / cashTarget : 1;
  if (savingsCoverage >= 1) {
    score += 20;
    strengths.push("savings cover the target down payment and emergency buffer");
  } else if (savingsCoverage >= 0.75) {
    score += 14;
    concerns.push("savings are close, but the cash buffer is not fully covered");
  } else if (savingsCoverage >= 0.5) {
    score += 8;
    concerns.push("more savings would make this safer");
  } else {
    concerns.push("the savings gap is large for this home");
  }

  const desiredPlace = String(userPlan.location || "").toLowerCase().split(",")[0].trim();
  if (desiredPlace && String(listing.location).toLowerCase().includes(desiredPlace)) {
    score += 10;
    strengths.push("it matches the desired area");
  } else if (desiredPlace) {
    score += 4;
  }

  if (!userPlan.homeType || userPlan.homeType === "Any" || userPlan.homeType === listing.type) {
    score += 10;
    strengths.push("it matches the preferred home type");
  }

  const credit = Number(userPlan.creditScore || 0);
  if (credit >= 740) score += 5;
  else if (credit >= 680) score += 3;
  else if (credit < 620) concerns.push("credit may make this harder to finance");

  score = Math.min(100, Math.round(score));
  const rating = score >= 78 ? "Favorable" : score >= 64 ? "Good Match" : score >= 48 ? "Possible" : score >= 32 ? "Risky" : "Not the Best";
  const explanation = rating === "Favorable"
    ? `This home is favorable because ${strengths.slice(0, 3).join(", ")}.`
    : `This home is ${rating.toLowerCase()} because ${concerns.slice(0, 3).join(", ") || "it only partially matches the strongest parts of the plan"}.`;

  return { ...listing, score, rating, explanation, plan: listingPlan };
}

export function matchListings(listings, userPlan) {
  return listings
    .map((listing) => scoreListing(listing, userPlan))
    .sort((a, b) => b.score - a.score);
}
