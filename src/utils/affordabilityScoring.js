import { defaultAssumptions } from "../data/defaultAssumptions";

export function scoreReadiness(plan) {
  let score = 0;
  const actions = [];

  if (plan.housingRatio <= defaultAssumptions.maxHousingRatio) score += 25;
  else actions.push("Lower the target home price or increase income so housing stays near 28% of gross income.");

  if (plan.dtiRatio <= 36) score += 25;
  else if (plan.dtiRatio <= defaultAssumptions.maxDtiRatio) score += 15;
  else actions.push("Pay down monthly debt before applying, because total debt-to-income is above a common lender comfort zone.");

  if (plan.downPaymentPct >= 20) score += 20;
  else if (plan.downPaymentPct >= 10) score += 12;
  else actions.push("Build the down payment to reduce PMI and lower the monthly payment.");

  if (plan.savings >= plan.requiredDownPayment + plan.emergencyTarget) score += 20;
  else actions.push("Keep emergency savings separate from the down payment so buying does not drain all cash.");

  const credit = Number(plan.creditScore || 0);
  if (credit >= 740) score += 10;
  else if (credit >= 680) score += 6;
  else actions.push("Improve credit before buying to qualify for better rates and safer loan options.");

  const category = score >= 90 ? "Strong Candidate" : score >= 75 ? "Ready" : score >= 60 ? "Almost Ready" : score >= 40 ? "Needs Improvement" : "Not Ready";
  const summary = category === "Strong Candidate" || category === "Ready"
    ? "The plan appears financially workable if the assumptions match real lender quotes."
    : "The plan needs adjustment before buying would be financially comfortable.";

  return { score, category, summary, actions: actions.length ? actions : ["Compare lender quotes, inspect taxes carefully, and keep a cash buffer after closing."] };
}

export function describeCreditImpact(score) {
  const value = Number(score || 0);
  if (value >= 740) return "Your credit score should help you compete for stronger mortgage terms.";
  if (value >= 680) return "Your credit score is workable, but a higher score could improve your rate.";
  if (value >= 620) return "Your credit score may limit loan options or raise the interest rate.";
  return "Your credit score is likely a major blocker for conventional mortgage approval.";
}
